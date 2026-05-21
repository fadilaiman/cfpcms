import { supabaseAdmin } from '$lib/supabase.server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { data: product } = await supabaseAdmin
		.from('products')
		.select('*')
		.eq('slug', params.slug)
		.eq('is_active', true)
		.single();

	if (!product) {
		error(404, 'Product not found');
	}

	return { product };
};
