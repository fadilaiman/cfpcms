import { supabaseAdmin } from '$lib/supabase.server';
import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export const load: PageServerLoad = async ({ params }) => {
	const { data: product } = await supabaseAdmin
		.from('products')
		.select('*')
		.eq('id', params.id)
		.single();

	if (!product) error(404, 'Product not found');

	return { product };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const form = await request.formData();

		const name = String(form.get('name') ?? '').trim();
		const description = String(form.get('description') ?? '').trim();
		const price = parseFloat(String(form.get('price') ?? '0'));
		const type = String(form.get('type') ?? 'physical') as 'physical' | 'digital';
		const stockRaw = form.get('stock');
		const stock = type === 'digital' ? null : (stockRaw !== null && stockRaw !== '' ? parseInt(String(stockRaw)) : 0);
		const is_active = form.get('is_active') === 'true';

		if (!name || isNaN(price) || price < 0) {
			return fail(400, { error: 'Name and a valid price are required.' });
		}

		const slug = slugify(name);

		const { error: err } = await supabaseAdmin
			.from('products')
			.update({
				name,
				slug,
				description: description || null,
				price,
				type,
				stock,
				is_active
			})
			.eq('id', params.id);

		if (err) {
			if (err.code === '23505') {
				return fail(400, { error: 'Another product already has this name.' });
			}
			return fail(500, { error: 'Failed to update product.' });
		}

		redirect(303, '/admin/products');
	}
};
