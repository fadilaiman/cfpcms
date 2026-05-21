import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.' });
		}

		const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });

		if (error || !data.session) {
			return fail(401, { error: 'Invalid email or password.' });
		}

		const { access_token, refresh_token, expires_in } = data.session;
		// Only set Secure flag on HTTPS — on HTTP localhost it prevents cookies being sent
		const secure = url.protocol === 'https:';

		cookies.set('sb-access-token', access_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure,
			maxAge: expires_in
		});
		cookies.set('sb-refresh-token', refresh_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure,
			maxAge: 60 * 60 * 24 * 30
		});

		redirect(303, '/admin');
	}
};
