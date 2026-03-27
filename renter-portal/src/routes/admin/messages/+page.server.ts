import { fail } from '@sveltejs/kit';
import sql from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const messages = await sql`
		SELECT * FROM messages ORDER BY created_at DESC
	`;
	return { messages };
};

export const actions = {
	markRead: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Missing id.' });

		await sql`UPDATE messages SET read = TRUE WHERE id = ${Number(id)}`;
		return { success: true };
	},
	markAllRead: async () => {
		await sql`UPDATE messages SET read = TRUE WHERE read = FALSE`;
		return { success: true };
	}
} satisfies Actions;
