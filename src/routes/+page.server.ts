import { supabaseAdmin } from '$lib/supabase.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { data: featured } = await supabaseAdmin
		.from('products')
		.select('id, name, slug, price, images')
		.eq('is_active', true)
		.order('created_at', { ascending: false })
		.limit(8);

	return { featured: featured ?? [] };
};
