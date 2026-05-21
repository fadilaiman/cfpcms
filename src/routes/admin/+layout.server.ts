import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

function parseJwt(token: string): Record<string, unknown> | null {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;
		// atob is available in Node 16+ and all browser environments
		const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
		return JSON.parse(payload);
	} catch {
		return null;
	}
}

export const load: LayoutServerLoad = async ({ cookies }) => {
	const accessToken = cookies.get('sb-access-token');
	const refreshToken = cookies.get('sb-refresh-token');

	if (!accessToken || !refreshToken) {
		redirect(303, '/login');
	}

	const payload = parseJwt(accessToken!);

	if (!payload?.sub || typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) {
		redirect(303, '/login');
	}

	return {
		user: {
			id: String(payload.sub),
			email: typeof payload.email === 'string' ? payload.email : ''
		}
	};
};
