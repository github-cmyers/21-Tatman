import { fail } from '@sveltejs/kit';
import sql from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const statusFilter = url.searchParams.get('status') || 'all';

	let applications;
	if (statusFilter === 'all') {
		applications = await sql`
			SELECT * FROM rental_applications ORDER BY created_at DESC
		`;
	} else {
		applications = await sql`
			SELECT * FROM rental_applications WHERE status = ${statusFilter} ORDER BY created_at DESC
		`;
	}

	return { applications, statusFilter };
};

export const actions = {
	updateStatus: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const status = data.get('status') as string;

		if (!id || !status) {
			return fail(400, { error: 'Missing id or status.' });
		}

		const validStatuses = ['pending', 'reviewed', 'approved', 'rejected'];
		if (!validStatuses.includes(status)) {
			return fail(400, { error: 'Invalid status.' });
		}

		await sql`
			UPDATE rental_applications
			SET status = ${status}
			WHERE id = ${Number(id)}
		`;

		return { success: true };
	}
} satisfies Actions;
