import { supabaseAdmin } from '$lib/supabase.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { data: products } = await supabaseAdmin
		.from('products')
		.select('id, name, slug, price, images, type, stock')
		.eq('is_active', true)
		.order('created_at', { ascending: false });

	return { products: products ?? [] };
};
