import { fail } from '@sveltejs/kit';
import sql from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { tenant: locals.tenant };
};

export const actions = {
	default: async ({ request, locals }) => {
		const tenant = locals.tenant!;
		const data = await request.formData();

		const message = data.get('message') as string;

		if (!message) {
			return fail(400, { error: 'Message is required.' });
		}

		await sql`
			INSERT INTO messages (tenant_id, unit, name, message)
			VALUES (${tenant.id}, ${tenant.unit}, ${tenant.name}, ${message})
		`;

		return { success: true };
	}
} satisfies Actions;
