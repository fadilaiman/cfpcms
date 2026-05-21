import { supabaseAdmin } from '$lib/supabase.server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { data: order } = await supabaseAdmin
		.from('orders')
		.select('*, order_items(*)')
		.eq('id', params.id)
		.single();

	if (!order) error(404, 'Order not found');

	return { order };
};

export const actions: Actions = {
	updateStatus: async ({ request, params }) => {
		const form = await request.formData();
		const status = String(form.get('status'));

		await supabaseAdmin
			.from('orders')
			.update({ status, updated_at: new Date().toISOString() })
			.eq('id', params.id);
	}
};
