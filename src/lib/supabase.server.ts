import { createClient } from '@supabase/supabase-js';
import { env as pub } from '$env/dynamic/public';
import { env as priv } from '$env/dynamic/private';

export function getSupabaseAdmin() {
	return createClient(pub.PUBLIC_SUPABASE_URL, priv.SUPABASE_SERVICE_ROLE_KEY, {
		auth: { persistSession: false }
	});
}

// Proxy so all existing callers (supabaseAdmin.from(...) etc.) work unchanged.
// Client is created inside each request handler where Cloudflare env vars are available.
export const supabaseAdmin = new Proxy(
	{} as ReturnType<typeof getSupabaseAdmin>,
	{ get: (_, prop) => Reflect.get(getSupabaseAdmin(), prop) }
);
