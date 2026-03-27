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

	await sql`
		CREATE TABLE IF NOT EXISTS rental_applications (
			id SERIAL PRIMARY KEY,
			status VARCHAR(20) NOT NULL DEFAULT 'pending',
			desired_move_in DATE,
			desired_unit VARCHAR(10),
			lease_term VARCHAR(20),
			applicant_first_name VARCHAR(255) NOT NULL,
			applicant_last_name VARCHAR(255) NOT NULL,
			applicant_email VARCHAR(255) NOT NULL,
			applicant_phone VARCHAR(50) NOT NULL,
			date_of_birth DATE,
			current_address TEXT,
			current_city VARCHAR(255),
			current_state VARCHAR(50),
			current_zip VARCHAR(20),
			current_landlord_name VARCHAR(255),
			current_landlord_phone VARCHAR(50),
			current_rent NUMERIC(10,2),
			current_residence_duration VARCHAR(100),
			reason_for_leaving TEXT,
			previous_address TEXT,
			previous_landlord_name VARCHAR(255),
			previous_landlord_phone VARCHAR(50),
			employer_name VARCHAR(255),
			employer_phone VARCHAR(50),
			job_title VARCHAR(255),
			monthly_income NUMERIC(10,2),
			employment_duration VARCHAR(100),
			additional_income NUMERIC(10,2),
			additional_income_source VARCHAR(255),
			num_occupants INTEGER DEFAULT 1,
			occupant_names TEXT,
			has_pets BOOLEAN DEFAULT FALSE,
			pet_details TEXT,
			has_vehicles BOOLEAN DEFAULT FALSE,
			num_vehicles INTEGER,
			vehicle_details TEXT,
			has_felony BOOLEAN DEFAULT FALSE,
			felony_details TEXT,
			has_eviction BOOLEAN DEFAULT FALSE,
			eviction_details TEXT,
			emergency_contact_name VARCHAR(255),
			emergency_contact_phone VARCHAR(50),
			emergency_contact_relationship VARCHAR(100),
			reference1_name VARCHAR(255),
			reference1_phone VARCHAR(50),
			reference1_relationship VARCHAR(100),
			reference2_name VARCHAR(255),
			reference2_phone VARCHAR(50),
			reference2_relationship VARCHAR(100),
			additional_comments TEXT,
			consent_background_check BOOLEAN NOT NULL DEFAULT FALSE,
			consent_terms BOOLEAN NOT NULL DEFAULT FALSE,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;

	await sql`
		CREATE TABLE IF NOT EXISTS request_comments (
			id SERIAL PRIMARY KEY,
			request_id INTEGER NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
			tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL,
			author_name VARCHAR(255) NOT NULL,
			is_admin BOOLEAN NOT NULL DEFAULT FALSE,
			comment TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;

	await sql`
		CREATE TABLE IF NOT EXISTS password_reset_tokens (
			id SERIAL PRIMARY KEY,
			tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
			token VARCHAR(64) UNIQUE NOT NULL,
			expires_at TIMESTAMPTZ NOT NULL,
			used BOOLEAN NOT NULL DEFAULT FALSE,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;

	// Backfill columns for tables created before auth was added
	await sql`ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
	await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
	await sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE`;

	// Backfill rental_applications columns
	await sql`ALTER TABLE rental_applications ADD COLUMN IF NOT EXISTS num_vehicles INTEGER`;
}
