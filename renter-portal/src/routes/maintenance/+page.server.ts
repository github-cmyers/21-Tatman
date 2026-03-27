import { fail } from '@sveltejs/kit';
import sql from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const tenant = locals.tenant!;

	const requests = await sql`
		SELECT id, category, urgency, description, status, created_at, updated_at
		FROM maintenance_requests
		WHERE tenant_id = ${tenant.id}
		ORDER BY created_at DESC
	`;

	return { tenant, requests };
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

		return { success: true };
	}
} satisfies Actions;
