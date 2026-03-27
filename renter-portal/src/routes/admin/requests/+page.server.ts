import { fail } from '@sveltejs/kit';
import sql from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const statusFilter = url.searchParams.get('status') || 'all';

	let requests;
	if (statusFilter === 'all') {
		requests = await sql`
			SELECT * FROM maintenance_requests ORDER BY created_at DESC
		`;
	} else {
		requests = await sql`
			SELECT * FROM maintenance_requests WHERE status = ${statusFilter} ORDER BY created_at DESC
		`;
	}

	return { requests, statusFilter };
};

export const actions = {
	updateStatus: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const status = data.get('status') as string;

		if (!id || !status) {
			return fail(400, { error: 'Missing id or status.' });
		}

		await sql`
			UPDATE maintenance_requests
			SET status = ${status}, updated_at = NOW()
			WHERE id = ${Number(id)}
		`;

		return { success: true };
	}
} satisfies Actions;
