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

export async function createPasswordResetToken(tenantId: number): Promise<string> {
	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

	await sql`
		INSERT INTO password_reset_tokens (tenant_id, token, expires_at)
		VALUES (${tenantId}, ${token}, ${expiresAt})
	`;

	return token;
}

export async function validateResetToken(token: string) {
	const results = await sql`
		SELECT prt.id, prt.tenant_id, t.email, t.name
		FROM password_reset_tokens prt
		JOIN tenants t ON t.id = prt.tenant_id
		WHERE prt.token = ${token} AND prt.expires_at > NOW() AND prt.used = FALSE
	`;

	if (results.length === 0) return null;

	return {
		id: results[0].id,
		tenantId: results[0].tenant_id,
		email: results[0].email,
		name: results[0].name
	};
}

export async function consumeResetToken(token: string) {
	await sql`UPDATE password_reset_tokens SET used = TRUE WHERE token = ${token}`;
}
