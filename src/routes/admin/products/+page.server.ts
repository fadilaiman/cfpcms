import { supabaseAdmin } from '$lib/supabase.server';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { data: products } = await supabaseAdmin
		.from('products')
		.select('id, name, slug, price, type, stock, is_active, created_at')
		.order('created_at', { ascending: false });

	return { products: products ?? [] };
};

export const actions: Actions = {
	toggleActive: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id'));
		const isActive = form.get('is_active') === 'true';

		await supabaseAdmin.from('products').update({ is_active: !isActive }).eq('id', id);
	},
	delete: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id'));

		const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
		if (error) return fail(500, { error: 'Failed to delete product.' });
	}
};
