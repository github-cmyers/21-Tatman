import { fail } from '@sveltejs/kit';
import sql from '$lib/server/db';
import { createPasswordResetToken } from '$lib/server/auth';
import { sendPasswordResetEmail } from '$lib/server/email';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, url }) => {
		const data = await request.formData();
		const email = (data.get('email') as string)?.trim().toLowerCase();

		if (!email) {
			return fail(400, { error: 'Email is required.', email });
		}

		// Always show success to prevent email enumeration
		const results = await sql`
			SELECT id, name, email FROM tenants WHERE email = ${email}
		`;

		if (results.length > 0) {
			const tenant = results[0];
			const token = await createPasswordResetToken(tenant.id);
			const resetUrl = `${url.origin}/reset-password?token=${token}`;

			try {
				await sendPasswordResetEmail({
					tenantName: tenant.name,
					email: tenant.email,
					resetUrl
				});
			} catch {
				return fail(500, { error: 'Unable to send the reset email. Please try again later or contact your property manager.', email });
			}
		}

		return { success: true, email };
	}
} satisfies Actions;
