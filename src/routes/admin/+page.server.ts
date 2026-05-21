import { supabaseAdmin } from '$lib/supabase.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [orders, revenue, pending] = await Promise.all([
		supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }),
		supabaseAdmin.from('orders').select('total').eq('payment_status', 'paid'),
		supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'processing')
	]);

	const totalRevenue = (revenue.data ?? []).reduce((sum, o) => sum + Number(o.total), 0);

	return {
		totalOrders: orders.count ?? 0,
		totalRevenue,
		pendingOrders: pending.count ?? 0
	};
};
