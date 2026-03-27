import { redirect, type Handle } from '@sveltejs/kit';
import { migrate } from '$lib/server/migrate';
import { validateSession } from '$lib/server/auth';

await migrate();

const publicRoutes = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');

	if (sessionId) {
		const session = await validateSession(sessionId);
		event.locals.tenant = session?.tenant ?? null;
	} else {
		event.locals.tenant = null;
	}

	const isPublicRoute = publicRoutes.some((r) => event.url.pathname.startsWith(r));

	if (!event.locals.tenant && !isPublicRoute) {
		throw redirect(302, '/login');
	}

	if (event.url.pathname.startsWith('/admin') && !event.locals.tenant?.isAdmin) {
		throw redirect(302, '/');
	}

	return resolve(event);
};
