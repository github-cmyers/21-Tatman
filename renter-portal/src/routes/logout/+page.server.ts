import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions = {
	default: async ({ cookies }) => {
		const sessionId = cookies.get('session');
		if (sessionId) {
			await deleteSession(sessionId);
		}
		cookies.delete('session', { path: '/' });
		throw redirect(302, '/login');
	}
} satisfies Actions;
