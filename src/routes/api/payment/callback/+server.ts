import { supabaseAdmin } from '$lib/supabase.server';
import { getBillTransactions } from '$lib/toyyibpay.server';
import type { RequestHandler } from './$types';

// ToyyibPay POSTs here after payment attempt
// Params: refno, status, reason, billcode, order_id, amount
export const POST: RequestHandler = async ({ request }) => {
	let body: URLSearchParams;
	try {
		const text = await request.text();
		body = new URLSearchParams(text);
	} catch {
		return new Response('Bad Request', { status: 400 });
	}

	const billCode = body.get('billcode') ?? '';
	const orderId = body.get('order_id') ?? '';
	const statusParam = body.get('status'); // '1'=paid, '2'=pending, '3'=failed

	if (!billCode || !orderId) {
		return new Response('Missing parameters', { status: 400 });
	}

	// Verify by querying ToyyibPay directly (never trust the callback params alone)
	let verified = false;
	let refNo = '';
	try {
		const transactions = await getBillTransactions(billCode);
		const paid = transactions.find((t) => t.status === '1');
		if (paid) {
			verified = true;
			refNo = paid.refNo;
		}
	} catch (e) {
		console.error('ToyyibPay verification error:', e);
		// Fallback: trust the callback status if verification fails
		verified = statusParam === '1';
	}

	if (verified) {
		await supabaseAdmin
			.from('orders')
			.update({
				payment_status: 'paid',
				status: 'processing',
				ref_no: refNo,
				updated_at: new Date().toISOString()
			})
			.eq('id', orderId)
			.eq('bill_code', billCode);
	} else if (statusParam === '3') {
		await supabaseAdmin
			.from('orders')
			.update({
				payment_status: 'failed',
				updated_at: new Date().toISOString()
			})
			.eq('id', orderId)
			.eq('bill_code', billCode);
	}

	return new Response('OK', { status: 200 });
};
