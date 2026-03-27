import { fail } from '@sveltejs/kit';
import sql from '$lib/server/db';
import { sendRentalApplicationEmail } from '$lib/server/email';
import type { Actions } from './$types';

const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePhone(value: string | null, fieldName: string): string | null {
	if (!value) return null;
	if (!PHONE_REGEX.test(value)) return `${fieldName} must be exactly 10 digits.`;
	return null;
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const firstName = (data.get('first_name') as string)?.trim();
		const lastName = (data.get('last_name') as string)?.trim();
		const email = (data.get('email') as string)?.trim();
		const phone = (data.get('phone') as string)?.trim();
		const consentBackground = data.get('consent_background_check');
		const consentTerms = data.get('consent_terms');

		if (!firstName || !lastName) {
			return fail(400, { error: 'First and last name are required.' });
		}

		if (!email || !EMAIL_REGEX.test(email)) {
			return fail(400, { error: 'A valid email address is required.' });
		}

		if (!phone || !PHONE_REGEX.test(phone)) {
			return fail(400, { error: 'Phone number must be exactly 10 digits.' });
		}

		if (!consentBackground || !consentTerms) {
			return fail(400, { error: 'You must agree to the background check and terms to submit your application.' });
		}

		// Validate optional phone fields
		const currentLandlordPhone = (data.get('current_landlord_phone') as string)?.trim() || null;
		const employerPhone = (data.get('employer_phone') as string)?.trim() || null;
		const reference1Phone = (data.get('reference1_phone') as string)?.trim() || null;
		const reference2Phone = (data.get('reference2_phone') as string)?.trim() || null;

		const phoneErrors = [
			validatePhone(currentLandlordPhone, 'Current landlord phone'),
			validatePhone(employerPhone, 'Employer phone'),
			validatePhone(reference1Phone, 'Reference 1 phone'),
			validatePhone(reference2Phone, 'Reference 2 phone')
		].filter(Boolean);

		if (phoneErrors.length > 0) {
			return fail(400, { error: phoneErrors[0] });
		}

		const desiredMoveIn = (data.get('desired_move_in') as string) || null;
		const leaseTerm = (data.get('lease_term') as string) || null;
		const dob = (data.get('date_of_birth') as string) || null;

		const currentAddress = (data.get('current_address') as string)?.trim() || null;
		const currentCity = (data.get('current_city') as string)?.trim() || null;
		const currentState = (data.get('current_state') as string)?.trim() || null;
		const currentZip = (data.get('current_zip') as string)?.trim() || null;
		const currentLandlordName = (data.get('current_landlord_name') as string)?.trim() || null;
		const currentRent = (data.get('current_rent') as string) || null;
		const currentResidenceDuration = (data.get('current_residence_duration') as string)?.trim() || null;
		const reasonForLeaving = (data.get('reason_for_leaving') as string)?.trim() || null;

		const employerName = (data.get('employer_name') as string)?.trim() || null;
		const jobTitle = (data.get('job_title') as string)?.trim() || null;
		const monthlyIncome = (data.get('monthly_income') as string) || null;
		const employmentDuration = (data.get('employment_duration') as string)?.trim() || null;
		const additionalIncome = (data.get('additional_income') as string) || null;
		const additionalIncomeSource = (data.get('additional_income_source') as string)?.trim() || null;

		const numOccupants = parseInt(data.get('num_occupants') as string) || 1;
		const occupantNames = (data.get('occupant_names') as string)?.trim() || null;
		const hasPets = data.get('has_pets') === 'on';
		const petDetails = (data.get('pet_details') as string)?.trim() || null;
		const hasVehicles = data.get('has_vehicles') === 'on';
		const numVehicles = hasVehicles ? (parseInt(data.get('num_vehicles') as string) || 2) : null;
		const vehicleDetails = (data.get('vehicle_details') as string)?.trim() || null;

		const hasFelony = data.get('has_felony') === 'on';
		const felonyDetails = (data.get('felony_details') as string)?.trim() || null;
		const hasEviction = data.get('has_eviction') === 'on';
		const evictionDetails = (data.get('eviction_details') as string)?.trim() || null;


		const reference1Name = (data.get('reference1_name') as string)?.trim() || null;
		const reference1Relationship = (data.get('reference1_relationship') as string)?.trim() || null;
		const reference2Name = (data.get('reference2_name') as string)?.trim() || null;
		const reference2Relationship = (data.get('reference2_relationship') as string)?.trim() || null;

		const additionalComments = (data.get('additional_comments') as string)?.trim() || null;

		await sql`
			INSERT INTO rental_applications (
				desired_move_in, lease_term,
				applicant_first_name, applicant_last_name, applicant_email, applicant_phone,
				date_of_birth,
				current_address, current_city, current_state, current_zip,
				current_landlord_name, current_landlord_phone, current_rent, current_residence_duration, reason_for_leaving,
				employer_name, employer_phone, job_title, monthly_income, employment_duration,
				additional_income, additional_income_source,
				num_occupants, occupant_names, has_pets, pet_details, has_vehicles, num_vehicles, vehicle_details,
				has_felony, felony_details, has_eviction, eviction_details,
				reference1_name, reference1_phone, reference1_relationship,
				reference2_name, reference2_phone, reference2_relationship,
				additional_comments, consent_background_check, consent_terms
			) VALUES (
				${desiredMoveIn}, ${leaseTerm},
				${firstName}, ${lastName}, ${email}, ${phone},
				${dob},
				${currentAddress}, ${currentCity}, ${currentState}, ${currentZip},
				${currentLandlordName}, ${currentLandlordPhone}, ${currentRent ? parseFloat(currentRent) : null}, ${currentResidenceDuration}, ${reasonForLeaving},
				${employerName}, ${employerPhone}, ${jobTitle}, ${monthlyIncome ? parseFloat(monthlyIncome) : null}, ${employmentDuration},
				${additionalIncome ? parseFloat(additionalIncome) : null}, ${additionalIncomeSource},
				${numOccupants}, ${occupantNames}, ${hasPets}, ${petDetails}, ${hasVehicles}, ${numVehicles}, ${vehicleDetails},
				${hasFelony}, ${felonyDetails}, ${hasEviction}, ${evictionDetails},
				${reference1Name}, ${reference1Phone}, ${reference1Relationship},
				${reference2Name}, ${reference2Phone}, ${reference2Relationship},
				${additionalComments}, ${true}, ${true}
			)
		`;

		sendRentalApplicationEmail({
			applicantName: `${firstName} ${lastName}`,
			email,
			phone,
			desiredMoveIn
		}).catch(() => {});

		return { success: true };
	}
} satisfies Actions;
