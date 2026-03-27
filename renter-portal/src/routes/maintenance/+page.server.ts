import { fail } from '@sveltejs/kit';
import sql from '$lib/server/db';
import { sendMaintenanceRequestEmail } from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const tenant = locals.tenant!;

	const requests = await sql`
		SELECT id, category, urgency, description, status, created_at, updated_at
		FROM maintenance_requests
		WHERE tenant_id = ${tenant.id}
		ORDER BY created_at DESC
	`;

	// Load comments for all tenant requests
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

	return { tenant, requests, comments };
};

export const actions = {
	default: async ({ request, locals }) => {
		const tenant = locals.tenant!;
		const data = await request.formData();

		const category = data.get('category') as string;
		const urgency = data.get('urgency') as string;
		const description = data.get('description') as string;
		const preferredTime = (data.get('preferredTime') as string) || null;

		if (!category || !description) {
			return fail(400, { error: 'Category and description are required.' });
		}

		await sql`
			INSERT INTO maintenance_requests (tenant_id, unit, name, phone, category, urgency, description, preferred_time)
			VALUES (${tenant.id}, ${tenant.unit}, ${tenant.name}, ${tenant.phone ?? ''}, ${category}, ${urgency}, ${description}, ${preferredTime})
		`;

		sendMaintenanceRequestEmail({
			tenantName: tenant.name,
			unit: tenant.unit,
			category,
			urgency,
			description,
			preferredTime
		}).catch(() => {});

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

		// Verify the request belongs to this tenant
		const req = await sql`
			SELECT id FROM maintenance_requests WHERE id = ${Number(requestId)} AND tenant_id = ${tenant.id}
		`;
		if (req.length === 0) {
			return fail(403, { error: 'Not authorized.' });
		}

		await sql`
			INSERT INTO request_comments (request_id, tenant_id, author_name, is_admin, comment)
			VALUES (${Number(requestId)}, ${tenant.id}, ${tenant.name}, FALSE, ${comment})
		`;

		return { success: true };
	}
} satisfies Actions;
