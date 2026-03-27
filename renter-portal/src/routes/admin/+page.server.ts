import sql from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [requestStats] = await sql`
		SELECT
			COUNT(*) FILTER (WHERE status = 'pending') as pending,
			COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
			COUNT(*) FILTER (WHERE status = 'completed') as completed,
			COUNT(*) as total
		FROM maintenance_requests
	`;

	const [messageStats] = await sql`
		SELECT
			COUNT(*) FILTER (WHERE read = FALSE) as unread,
			COUNT(*) as total
		FROM messages
	`;

	const [tenantStats] = await sql`
		SELECT COUNT(*) as total FROM tenants WHERE is_admin = FALSE
	`;

	const recentRequests = await sql`
		SELECT id, unit, name, category, urgency, status, created_at
		FROM maintenance_requests
		ORDER BY created_at DESC
		LIMIT 5
	`;

	return {
		requestStats,
		messageStats,
		tenantStats,
		recentRequests
	};
};
