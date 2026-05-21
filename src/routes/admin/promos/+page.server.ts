import { supabaseAdmin } from '$lib/supabase.server';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { data: promos } = await supabaseAdmin
		.from('promos')
		.select('*')
		.order('created_at', { ascending: false });

	return { promos: promos ?? [] };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const code = String(form.get('code') ?? '').trim().toUpperCase();
		const type = String(form.get('type') ?? 'percentage') as 'percentage' | 'fixed';
		const value = parseFloat(String(form.get('value') ?? '0'));
		const minOrder = parseFloat(String(form.get('min_order') ?? '0')) || 0;
		const maxUsesRaw = form.get('max_uses');
		const maxUses = maxUsesRaw ? parseInt(String(maxUsesRaw)) : null;
		const expiresAt = String(form.get('expires_at') ?? '').trim() || null;

		if (!code || isNaN(value) || value <= 0) {
			return fail(400, { error: 'Code and a valid value are required.' });
		}

		const { error } = await supabaseAdmin.from('promos').insert({
			code,
			type,
			value,
			min_order: minOrder,
			max_uses: maxUses,
			expires_at: expiresAt,
			is_active: true
		});

		if (error) {
			if (error.code === '23505') return fail(400, { error: 'Promo code already exists.' });
			return fail(500, { error: 'Failed to create promo.' });
		}
	},
	toggle: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id'));
		const isActive = form.get('is_active') === 'true';
		await supabaseAdmin.from('promos').update({ is_active: !isActive }).eq('id', id);
	},
	delete: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id'));
		await supabaseAdmin.from('promos').delete().eq('id', id);
	}
};
