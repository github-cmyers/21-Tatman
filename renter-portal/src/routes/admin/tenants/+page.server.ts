import { fail } from '@sveltejs/kit';
import sql from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const tenants = await sql`
		SELECT id, email, name, phone, unit, is_admin, created_at
		FROM tenants
		ORDER BY unit, name
	`;
	return { tenants };
};

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const email = (data.get('email') as string)?.trim().toLowerCase();
		const password = data.get('password') as string;
		const name = data.get('name') as string;
		const phone = (data.get('phone') as string) || null;
		const unit = data.get('unit') as string;

		if (!email || !password || !name || !unit) {
			return fail(400, { error: 'Email, password, name, and unit are required.' });
		}

		const existing = await sql`SELECT id FROM tenants WHERE email = ${email}`;
		if (existing.length > 0) {
			return fail(400, { error: 'A tenant with this email already exists.' });
		}

		const passwordHash = await hashPassword(password);

		await sql`
			INSERT INTO tenants (email, password_hash, name, phone, unit)
			VALUES (${email}, ${passwordHash}, ${name}, ${phone}, ${unit})
		`;

		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Missing id.' });

		// Don't allow deleting admin accounts
		const [tenant] = await sql`SELECT is_admin FROM tenants WHERE id = ${Number(id)}`;
		if (tenant?.is_admin) {
			return fail(400, { error: 'Cannot delete admin accounts.' });
		}

		await sql`DELETE FROM tenants WHERE id = ${Number(id)}`;
		return { success: true };
	}
} satisfies Actions;
