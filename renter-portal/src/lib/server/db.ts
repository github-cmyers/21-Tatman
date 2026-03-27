import postgres from 'postgres';

const sql = postgres({
	host: 'localhost',
	port: 5435,
	database: 'tatman_portal',
	username: 'tatman',
	password: 'tatman_dev_2026'
});

export default sql;
