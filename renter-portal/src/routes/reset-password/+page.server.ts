import { fail, redirect } from '@sveltejs/kit';
import sql from '$lib/server/db';
import { validateResetToken, consumeResetToken, hashPassword } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return { valid: false, email: null };
	}

	const result = await validateResetToken(token);
	if (!result) {
		return { valid: false, email: null };
	}

	return { valid: true, email: result.email, token };
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('token') as string;
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;

		if (!token || !password) {
			return fail(400, { error: 'Missing required fields.' });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters.' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match.' });
		}

		const result = await validateResetToken(token);
		if (!result) {
			return fail(400, { error: 'This reset link has expired or already been used. Please request a new one.' });
		}

		const passwordHash = await hashPassword(password);

		await sql`
			UPDATE tenants SET password_hash = ${passwordHash} WHERE id = ${result.tenantId}
		`;

		await consumeResetToken(token);

		// Invalidate all existing sessions for this user
		await sql`DELETE FROM sessions WHERE tenant_id = ${result.tenantId}`;

		return { success: true };
	}
} satisfies Actions;
