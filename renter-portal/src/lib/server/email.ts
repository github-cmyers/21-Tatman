import { Resend } from 'resend';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mail.cmyers@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@21tatman.com';

let resend: Resend | null = null;

function getResend(): Resend | null {
	if (!process.env.RESEND_API_KEY) return null;
	if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
	return resend;
}

export async function sendMaintenanceRequestEmail(params: {
	tenantName: string;
	unit: string;
	category: string;
	urgency: string;
	description: string;
	preferredTime?: string | null;
}) {
	const client = getResend();
	if (!client) return;

	const urgencyLabel = {
		low: 'Low',
		normal: 'Normal',
		high: 'HIGH',
		emergency: 'EMERGENCY'
	}[params.urgency] ?? params.urgency;

	await client.emails.send({
		from: `21 Tatman Portal <${FROM_EMAIL}>`,
		to: ADMIN_EMAIL,
		subject: `[${urgencyLabel}] Maintenance Request - Unit ${params.unit} - ${params.category}`,
		html: `
			<h2>New Maintenance Request</h2>
			<table style="border-collapse:collapse;width:100%;max-width:500px">
				<tr><td style="padding:8px;font-weight:bold">Tenant</td><td style="padding:8px">${params.tenantName}</td></tr>
				<tr><td style="padding:8px;font-weight:bold">Unit</td><td style="padding:8px">${params.unit}</td></tr>
				<tr><td style="padding:8px;font-weight:bold">Category</td><td style="padding:8px">${params.category}</td></tr>
				<tr><td style="padding:8px;font-weight:bold">Urgency</td><td style="padding:8px">${urgencyLabel}</td></tr>
				${params.preferredTime ? `<tr><td style="padding:8px;font-weight:bold">Preferred Time</td><td style="padding:8px">${params.preferredTime}</td></tr>` : ''}
			</table>
			<h3>Description</h3>
			<p>${params.description}</p>
			<hr>
			<p style="color:#666;font-size:12px">Sent from 21 Tatman Renter Portal</p>
		`
	});
}

export async function sendRentalApplicationEmail(params: {
	applicantName: string;
	email: string;
	phone: string;
	desiredMoveIn?: string | null;
}) {
	const client = getResend();
	if (!client) return;

	await client.emails.send({
		from: `21 Tatman Portal <${FROM_EMAIL}>`,
		to: ADMIN_EMAIL,
		subject: `New Rental Application - ${params.applicantName}`,
		html: `
			<h2>New Rental Application Received</h2>
			<table style="border-collapse:collapse;width:100%;max-width:500px">
				<tr><td style="padding:8px;font-weight:bold">Applicant</td><td style="padding:8px">${params.applicantName}</td></tr>
				<tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${params.email}</td></tr>
				<tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${params.phone}</td></tr>
				${params.desiredMoveIn ? `<tr><td style="padding:8px;font-weight:bold">Move-in Date</td><td style="padding:8px">${params.desiredMoveIn}</td></tr>` : ''}
			</table>
			<p>Log into the admin portal to review the full application.</p>
			<hr>
			<p style="color:#666;font-size:12px">Sent from 21 Tatman Renter Portal</p>
		`
	});
}

export async function sendContactMessageEmail(params: {
	tenantName: string;
	unit: string;
	message: string;
}) {
	const client = getResend();
	if (!client) return;

	await client.emails.send({
		from: `21 Tatman Portal <${FROM_EMAIL}>`,
		to: ADMIN_EMAIL,
		subject: `Message from ${params.tenantName} (Unit ${params.unit})`,
		html: `
			<h2>New Message from Tenant</h2>
			<p><strong>${params.tenantName}</strong> (Unit ${params.unit}) sent you a message:</p>
			<blockquote style="border-left:3px solid #e8a838;padding:12px;margin:16px 0;background:#f9f9f9">
				${params.message}
			</blockquote>
			<hr>
			<p style="color:#666;font-size:12px">Sent from 21 Tatman Renter Portal</p>
		`
	});
}
