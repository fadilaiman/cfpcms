import { supabaseAdmin } from '$lib/supabase.server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		const name = String(form.get('name') ?? '').trim();
		const description = String(form.get('description') ?? '').trim();
		const price = parseFloat(String(form.get('price') ?? '0'));
		const type = String(form.get('type') ?? 'physical') as 'physical' | 'digital';
		const stockRaw = form.get('stock');
		const stock = type === 'digital' ? null : (stockRaw ? parseInt(String(stockRaw)) : 0);

		if (!name || isNaN(price) || price < 0) {
			return fail(400, { error: 'Name and a valid price are required.' });
		}

		const slug = slugify(name);

		const { error } = await supabaseAdmin.from('products').insert({
			name,
			slug,
			description: description || null,
			price,
			type,
			stock,
			images: [],
			is_active: true
		});

		if (error) {
			if (error.code === '23505') {
				return fail(400, { error: 'A product with this name already exists.' });
			}
			return fail(500, { error: 'Failed to create product.' });
		}

		redirect(303, '/admin/products');
	}
};
