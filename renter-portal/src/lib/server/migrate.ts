import sql from './db';

export async function migrate() {
	await sql`
		CREATE TABLE IF NOT EXISTS tenants (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			name VARCHAR(255) NOT NULL,
			phone VARCHAR(50),
			unit VARCHAR(1) NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;

	await sql`
		CREATE TABLE IF NOT EXISTS sessions (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
			expires_at TIMESTAMPTZ NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;

	await sql`
		CREATE TABLE IF NOT EXISTS maintenance_requests (
			id SERIAL PRIMARY KEY,
			tenant_id INTEGER REFERENCES tenants(id),
			unit VARCHAR(1) NOT NULL,
			name VARCHAR(255) NOT NULL,
			phone VARCHAR(50) NOT NULL,
			category VARCHAR(100) NOT NULL,
			urgency VARCHAR(20) NOT NULL DEFAULT 'normal',
			description TEXT NOT NULL,
			preferred_time VARCHAR(255),
			status VARCHAR(20) NOT NULL DEFAULT 'pending',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;

	await sql`
		CREATE TABLE IF NOT EXISTS messages (
			id SERIAL PRIMARY KEY,
			tenant_id INTEGER REFERENCES tenants(id),
			unit VARCHAR(1) NOT NULL,
			name VARCHAR(255) NOT NULL,
			message TEXT NOT NULL,
			read BOOLEAN NOT NULL DEFAULT FALSE,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;

	// Backfill columns for tables created before auth was added
	await sql`ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
	await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
	await sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE`;
}
