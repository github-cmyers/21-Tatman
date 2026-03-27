import postgres from 'postgres';
import bcrypt from 'bcrypt';

const sql = postgres({
	host: 'localhost',
	port: 5435,
	database: 'tatman_portal',
	username: 'tatman',
	password: 'tatman_dev_2026'
});

const tenants = [
	{ email: 'unit1@21tatman.com', password: 'tenant1', name: 'Unit 1 Tenant', phone: '508-555-0001', unit: '1' },
	{ email: 'unit2@21tatman.com', password: 'tenant2', name: 'Unit 2 Tenant', phone: '508-555-0002', unit: '2' },
	{ email: 'unit3@21tatman.com', password: 'tenant3', name: 'Unit 3 Tenant', phone: '508-555-0003', unit: '3' }
];

async function seed() {
	console.log('Seeding tenants...');

	for (const t of tenants) {
		const hash = await bcrypt.hash(t.password, 10);

		await sql`
			INSERT INTO tenants (email, password_hash, name, phone, unit)
			VALUES (${t.email}, ${hash}, ${t.name}, ${t.phone}, ${t.unit})
			ON CONFLICT (email) DO NOTHING
		`;

		console.log(`  Created: ${t.email} / ${t.password} (Unit ${t.unit})`);
	}

	console.log('Done!');
	await sql.end();
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
