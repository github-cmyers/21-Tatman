import { fail, redirect } from '@sveltejs/kit';
import sql from '$lib/server/db';
import { verifyPassword, createSession } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.tenant) {
		throw redirect(302, '/');
	}
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = (data.get('email') as string)?.trim().toLowerCase();
		const password = data.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.', email });
		}

		const results = await sql`
			SELECT id, email, password_hash, name, unit
			FROM tenants
			WHERE email = ${email}
		`;

		if (results.length === 0) {
			return fail(400, { error: 'Invalid email or password.', email });
		}

		const tenant = results[0];
		const valid = await verifyPassword(password, tenant.password_hash);

		if (!valid) {
			return fail(400, { error: 'Invalid email or password.', email });
		}

		const sessionId = await createSession(tenant.id);

		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(302, '/');
	}
} satisfies Actions;
