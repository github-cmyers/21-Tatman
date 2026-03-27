import { fail } from '@sveltejs/kit';
import sql from '$lib/server/db';
import { sendMaintenanceStatusEmail } from '$lib/server/email';
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

	// Load comments for all requests
	const requestIds = requests.map((r) => r.id);
	let comments: Record<number, any[]> = {};
	if (requestIds.length > 0) {
		const allComments = await sql`
			SELECT * FROM request_comments
			WHERE request_id = ANY(${requestIds})
			ORDER BY created_at ASC
		`;
		for (const c of allComments) {
			if (!comments[c.request_id]) comments[c.request_id] = [];
			comments[c.request_id].push(c);
		}
	}

	return { requests, statusFilter, comments };
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

		// Notify tenant of status change via email
		const req = await sql`
			SELECT mr.category, mr.unit, t.email, t.name
			FROM maintenance_requests mr
			LEFT JOIN tenants t ON t.id = mr.tenant_id
			WHERE mr.id = ${Number(id)}
		`;
		if (req.length > 0 && req[0].email) {
			sendMaintenanceStatusEmail({
				tenantEmail: req[0].email,
				tenantName: req[0].name,
				category: req[0].category,
				status,
				unit: req[0].unit
			}).catch(() => {});
		}

		return { success: true };
	},

	addComment: async ({ request, locals }) => {
		const tenant = locals.tenant!;
		const data = await request.formData();
		const requestId = data.get('request_id') as string;
		const comment = (data.get('comment') as string)?.trim();

		if (!requestId || !comment) {
			return fail(400, { error: 'Comment is required.' });
		}

		await sql`
			INSERT INTO request_comments (request_id, tenant_id, author_name, is_admin, comment)
			VALUES (${Number(requestId)}, ${tenant.id}, ${tenant.name}, TRUE, ${comment})
		`;

		return { success: true };
	}
} satisfies Actions;
