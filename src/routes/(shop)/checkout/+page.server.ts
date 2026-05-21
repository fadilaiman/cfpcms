import { supabaseAdmin } from '$lib/supabase.server';
import { createBill } from '$lib/toyyibpay.server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { CartItem } from '$lib/stores/cart.svelte';
import type { ShippingAddress } from '$lib/types';

function generateOrderNumber(): string {
	const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
	const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
	return `ORD-${date}-${rand}`;
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		const customerName = String(form.get('name') ?? '').trim();
		const customerEmail = String(form.get('email') ?? '').trim();
		const customerPhone = String(form.get('phone') ?? '').trim();
		const promoCode = String(form.get('promo_code') ?? '').trim().toUpperCase();
		const cartJson = String(form.get('cart') ?? '[]');

		if (!customerName || !customerEmail || !customerPhone) {
			return fail(400, { error: 'Name, email and phone are required.' });
		}

		let cartItems: CartItem[];
		try {
			cartItems = JSON.parse(cartJson);
		} catch {
			return fail(400, { error: 'Invalid cart data.' });
		}

		if (cartItems.length === 0) {
			return fail(400, { error: 'Cart is empty.' });
		}

		const hasPhysical = cartItems.some((i) => i.type === 'physical');

		// Validate shipping if physical items exist
		let shippingAddress: ShippingAddress | null = null;
		if (hasPhysical) {
			const line1 = String(form.get('address_line1') ?? '').trim();
			const city = String(form.get('city') ?? '').trim();
			const state = String(form.get('state') ?? '').trim();
			const postcode = String(form.get('postcode') ?? '').trim();

			if (!line1 || !city || !state || !postcode) {
				return fail(400, { error: 'Shipping address is required for physical items.' });
			}

			shippingAddress = {
				line1,
				line2: String(form.get('address_line2') ?? '').trim() || undefined,
				city,
				state,
				postcode
			};
		}

		// Verify product prices from DB (never trust client-side prices)
		const productIds = cartItems.map((i) => i.productId);
		const { data: dbProducts } = await supabaseAdmin
			.from('products')
			.select('id, price, stock, type, is_active')
			.in('id', productIds);

		if (!dbProducts) {
			return fail(500, { error: 'Could not verify product prices.' });
		}

		const productMap = new Map(dbProducts.map((p) => [p.id, p]));

		// Build line items with server-verified prices
		let subtotal = 0;
		const lineItems = [];

		for (const item of cartItems) {
			const p = productMap.get(item.productId);
			if (!p || !p.is_active) {
				return fail(400, { error: `Product "${item.name}" is no longer available.` });
			}
			if (p.type === 'physical' && p.stock !== null && p.stock < item.quantity) {
				return fail(400, { error: `"${item.name}" has insufficient stock.` });
			}
			const totalPrice = p.price * item.quantity;
			subtotal += totalPrice;
			lineItems.push({
				product_id: item.productId,
				product_name: item.name,
				product_type: p.type,
				quantity: item.quantity,
				unit_price: p.price,
				total_price: totalPrice
			});
		}

		// Apply promo code
		let discount = 0;
		let appliedPromo: string | null = null;

		if (promoCode) {
			const { data: promo } = await supabaseAdmin
				.from('promos')
				.select('*')
				.eq('code', promoCode)
				.eq('is_active', true)
				.single();

			if (!promo) {
				return fail(400, { error: 'Invalid or expired promo code.' });
			}
			if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
				return fail(400, { error: 'Promo code has expired.' });
			}
			if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
				return fail(400, { error: 'Promo code usage limit reached.' });
			}
			if (subtotal < promo.min_order) {
				return fail(400, { error: `Minimum order of RM ${promo.min_order.toFixed(2)} required for this promo.` });
			}

			discount = promo.type === 'percentage'
				? (subtotal * promo.value) / 100
				: Math.min(promo.value, subtotal);

			appliedPromo = promo.code;
		}

		const total = Math.max(0, subtotal - discount);
		const orderNumber = generateOrderNumber();

		// Create order in Supabase
		const { data: order, error: orderErr } = await supabaseAdmin
			.from('orders')
			.insert({
				order_number: orderNumber,
				customer_name: customerName,
				customer_email: customerEmail,
				customer_phone: customerPhone,
				shipping_address: shippingAddress,
				subtotal,
				discount,
				total,
				promo_code: appliedPromo,
				status: 'pending',
				payment_status: 'pending'
			})
			.select('id')
			.single();

		if (orderErr || !order) {
			return fail(500, { error: 'Could not create order. Please try again.' });
		}

		// Insert line items
		await supabaseAdmin.from('order_items').insert(
			lineItems.map((item) => ({ ...item, order_id: order.id }))
		);

		// Create ToyyibPay bill
		let billCode: string;
		let paymentUrl: string;

		try {
			const bill = await createBill({
				orderId: order.id,
				orderNumber,
				customerName,
				customerEmail,
				customerPhone,
				totalCents: Math.round(total * 100),
				description: `Order ${orderNumber} — ${lineItems.length} item(s)`
			});
			billCode = bill.billCode;
			paymentUrl = bill.paymentUrl;
		} catch (e) {
			// Roll back order on payment creation failure
			await supabaseAdmin.from('orders').delete().eq('id', order.id);
			console.error('ToyyibPay createBill error:', e);
			return fail(500, { error: 'Could not initiate payment. Please try again.' });
		}

		// Save bill code to order
		await supabaseAdmin
			.from('orders')
			.update({ bill_code: billCode })
			.eq('id', order.id);

		// Increment promo usage
		if (appliedPromo) {
			await supabaseAdmin.rpc('increment_promo_usage', { promo_code_arg: appliedPromo });
		}

		redirect(303, paymentUrl);
	}
};
