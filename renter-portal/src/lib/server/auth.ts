import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import sql from './db';

const SESSION_DURATION_DAYS = 30;
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export async function createSession(tenantId: number): Promise<string> {
	const id = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

	await sql`
		INSERT INTO sessions (id, tenant_id, expires_at)
		VALUES (${id}, ${tenantId}, ${expiresAt})
	`;

	return id;
}

export async function validateSession(sessionId: string) {
	const results = await sql`
		SELECT s.id as session_id, s.expires_at, t.id as tenant_id, t.email, t.name, t.phone, t.unit, t.is_admin
		FROM sessions s
		JOIN tenants t ON t.id = s.tenant_id
		WHERE s.id = ${sessionId} AND s.expires_at > NOW()
	`;

	if (results.length === 0) return null;

	const row = results[0];
	return {
		sessionId: row.session_id,
		tenant: {
			id: row.tenant_id,
			email: row.email,
			name: row.name,
			phone: row.phone,
			unit: row.unit,
			isAdmin: row.is_admin
		}
	};
}

export async function deleteSession(sessionId: string) {
	await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
}
