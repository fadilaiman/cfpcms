import { supabaseAdmin } from '$lib/supabase.server';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { data: orders } = await supabaseAdmin
		.from('orders')
		.select('id, order_number, customer_name, customer_email, total, status, payment_status, created_at')
		.order('created_at', { ascending: false })
		.limit(100);

	return { orders: orders ?? [] };
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id'));
		const status = String(form.get('status'));

		await supabaseAdmin
			.from('orders')
			.update({ status, updated_at: new Date().toISOString() })
			.eq('id', id);
	}
};
