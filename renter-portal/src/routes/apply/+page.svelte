<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();

	let submitted = $state(false);
	let submitting = $state(false);
	let currentStep = $state(1);
	const totalSteps = 7;
	let stepError = $state('');

	let hasPets = $state(false);
	let hasVehicles = $state(false);
	let hasFelony = $state(false);
	let hasEviction = $state(false);

	let formEl: HTMLFormElement;

	function clearValidation(container: Element) {
		for (const el of container.querySelectorAll('.field-invalid')) {
			el.classList.remove('field-invalid');
		}
		for (const msg of container.querySelectorAll('.field-error-msg')) {
			msg.remove();
		}
	}

	function markInvalid(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, message: string) {
		input.classList.add('field-invalid');
		const existing = input.parentElement?.querySelector('.field-error-msg');
		if (!existing) {
			const msg = document.createElement('p');
			msg.className = 'field-error-msg text-red-500 dark:text-red-400 text-xs mt-1';
			msg.textContent = message;
			input.parentElement?.appendChild(msg);
		}
	}

	function validateCurrentStep(): boolean {
		stepError = '';

		const stepContainer = formEl.querySelector(`[data-step="${currentStep}"]`);
		if (!stepContainer) return true;

		clearValidation(stepContainer);

		let hasErrors = false;
		let firstInvalid: HTMLElement | null = null;

		// Check required fields
		const required = stepContainer.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
			'input[required], textarea[required], select[required]'
		);
		for (const input of required) {
			if (!input.value.trim()) {
				markInvalid(input, 'This field is required');
				hasErrors = true;
				if (!firstInvalid) firstInvalid = input;
			}
		}

		// Check phone fields (10 digits only)
		const phones = stepContainer.querySelectorAll<HTMLInputElement>('input[data-phone]');
		for (const input of phones) {
			const digits = input.value.replace(/\D/g, '');
			if (digits.length > 0 && digits.length !== 10) {
				markInvalid(input, 'Phone number must be exactly 10 digits');
				hasErrors = true;
				if (!firstInvalid) firstInvalid = input;
			}
		}

		// Check email validity
		const emails = stepContainer.querySelectorAll<HTMLInputElement>('input[type="email"]');
		for (const input of emails) {
			if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
				markInvalid(input, 'Enter a valid email address');
				hasErrors = true;
				if (!firstInvalid) firstInvalid = input;
			}
		}

		if (hasErrors) {
			stepError = 'Please fill in all highlighted fields before continuing.';
			firstInvalid?.focus();
		}

		return !hasErrors;
	}

	function nextStep() {
		if (!validateCurrentStep()) return;
		if (currentStep < totalSteps) currentStep++;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function prevStep() {
		stepError = '';
		const stepContainer = formEl?.querySelector(`[data-step="${currentStep}"]`);
		if (stepContainer) clearValidation(stepContainer);
		if (currentStep > 1) currentStep--;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleInput(e: Event) {
		const input = e.target as HTMLElement;
		if (input.classList.contains('field-invalid')) {
			input.classList.remove('field-invalid');
			const msg = input.parentElement?.querySelector('.field-error-msg');
			msg?.remove();
		}
	}
</script>

<svelte:head>
	<title>Apply - 21 Tatman</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Header for unauthenticated users -->
	<header class="bg-[var(--color-primary)] text-white shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<a href="/" class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-lg bg-[var(--color-accent)] flex items-center justify-center font-bold text-[var(--color-primary)] text-lg">
						21
					</div>
					<div>
						<div class="font-semibold text-lg leading-tight">21 Tatman St</div>
						<div class="text-xs text-blue-200">Rental Application</div>
					</div>
				</a>
				<a href="/login" class="px-4 py-2 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors">
					Tenant Login
				</a>
			</div>
		</div>
	</header>

	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if submitted}
			<div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-10 text-center">
				<div class="text-5xl mb-4">&#10003;</div>
				<h1 class="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">Application Submitted</h1>
				<p class="text-green-700 dark:text-green-400 mb-2">Thank you for applying to 21 Tatman Street.</p>
				<p class="text-green-600 dark:text-green-500 text-sm">We will review your application and contact you within 2-3 business days. If you have any questions, please email <strong>mail.cmyers@gmail.com</strong>.</p>
			</div>
		{:else}
			<div class="mb-8">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Rental Application</h1>
				<p class="text-gray-600 dark:text-gray-400">21 Tatman Street, Worcester, MA</p>
			</div>

			<!-- Progress Bar -->
			<div class="mb-8">
				<div class="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
					<span>Step {currentStep} of {totalSteps}</span>
					<span>{['Move-in Details', 'Personal Info', 'Current Residence', 'Employment', 'Occupants & Pets', 'Background & References', 'Review & Submit'][currentStep - 1]}</span>
				</div>
				<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
					<div
						class="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
						style="width: {(currentStep / totalSteps) * 100}%"
					></div>
				</div>
			</div>

			{#if form?.error}
				<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
					<p class="text-red-700 dark:text-red-400 text-sm">{form.error}</p>
				</div>
			{/if}

			{#if stepError}
				<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
					<p class="text-red-700 dark:text-red-400 text-sm">{stepError}</p>
				</div>
			{/if}

			<form
				bind:this={formEl}
				method="POST"
				oninput={handleInput}
				use:enhance={() => {
					submitting = true;
					stepError = '';
					return async ({ result, update }) => {
						submitting = false;
						if (result.type === 'success') {
							submitted = true;
							window.scrollTo({ top: 0, behavior: 'smooth' });
						} else {
							currentStep = totalSteps;
							await update();
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}
					};
				}}
				class="space-y-6"
			>
				<!-- Step 1: Desired Unit -->
				<div data-step="1" class={currentStep === 1 ? '' : 'hidden'}>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Move-in Details</h2>

						<div>
							<label for="desired_move_in" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Desired Move-in Date</label>
							<input type="date" id="desired_move_in" name="desired_move_in" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
						</div>

						<div>
							<label for="lease_term" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Lease Term</label>
							<select id="lease_term" name="lease_term" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none">
								<option value="12">12 Months</option>
								<option value="6">6 Months</option>
								<option value="month-to-month">Month-to-Month</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Step 2: Personal Information -->
				<div data-step="2" class={currentStep === 2 ? '' : 'hidden'}>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Information</h2>

						<div class="grid sm:grid-cols-2 gap-4">
							<div>
								<label for="first_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name <span class="text-red-500">*</span></label>
								<input type="text" id="first_name" name="first_name" required autocomplete="given-name" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
							<div>
								<label for="last_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name <span class="text-red-500">*</span></label>
								<input type="text" id="last_name" name="last_name" required autocomplete="family-name" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
						</div>

						<div class="grid sm:grid-cols-2 gap-4">
							<div>
								<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span class="text-red-500">*</span></label>
								<input type="email" id="email" name="email" required autocomplete="email" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
							<div>
								<label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone <span class="text-red-500">*</span></label>
								<input type="tel" id="phone" name="phone" required autocomplete="tel-national" data-phone placeholder="5085551234" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
						</div>

						<div>
							<label for="date_of_birth" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
							<input type="date" id="date_of_birth" name="date_of_birth" autocomplete="bday" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
						</div>
					</div>
				</div>

				<!-- Step 3: Current Residence -->
				<div data-step="3" class={currentStep === 3 ? '' : 'hidden'}>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Current Residence</h2>

						<div>
							<label for="current_address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address <span class="text-red-500">*</span></label>
							<input type="text" id="current_address" name="current_address" required autocomplete="street-address" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
						</div>

						<div class="grid sm:grid-cols-3 gap-4">
							<div>
								<label for="current_city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City <span class="text-red-500">*</span></label>
								<input type="text" id="current_city" name="current_city" required autocomplete="address-level2" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
							<div>
								<label for="current_state" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State <span class="text-red-500">*</span></label>
								<input type="text" id="current_state" name="current_state" required autocomplete="address-level1" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
							<div>
								<label for="current_zip" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP <span class="text-red-500">*</span></label>
								<input type="text" id="current_zip" name="current_zip" required autocomplete="postal-code" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
						</div>

						<div class="grid sm:grid-cols-2 gap-4">
							<div>
								<label for="current_landlord_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Landlord Name</label>
								<input type="text" id="current_landlord_name" name="current_landlord_name" autocomplete="off" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
							<div>
								<label for="current_landlord_phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Landlord Phone</label>
								<input type="tel" id="current_landlord_phone" name="current_landlord_phone" autocomplete="off" data-phone placeholder="5085551234" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
						</div>

						<div class="grid sm:grid-cols-2 gap-4">
							<div>
								<label for="current_rent" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Rent ($)</label>
								<input type="number" id="current_rent" name="current_rent" autocomplete="off" step="0.01" min="0" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
							<div>
								<label for="current_residence_duration" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How Long at This Address?</label>
								<input type="text" id="current_residence_duration" name="current_residence_duration" autocomplete="off" placeholder="e.g. 2 years" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
						</div>

						<div>
							<label for="reason_for_leaving" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Leaving</label>
							<input type="text" id="reason_for_leaving" name="reason_for_leaving" autocomplete="off" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
						</div>
					</div>

				</div>

				<!-- Step 4: Employment & Income -->
				<div data-step="4" class={currentStep === 4 ? '' : 'hidden'}>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Employment & Income</h2>

						<div class="grid sm:grid-cols-2 gap-4">
							<div>
								<label for="employer_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employer Name <span class="text-red-500">*</span></label>
								<input type="text" id="employer_name" name="employer_name" required autocomplete="organization" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
							<div>
								<label for="employer_phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employer Phone</label>
								<input type="tel" id="employer_phone" name="employer_phone" autocomplete="off" data-phone placeholder="5085551234" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
						</div>

						<div class="grid sm:grid-cols-2 gap-4">
							<div>
								<label for="job_title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title <span class="text-red-500">*</span></label>
								<input type="text" id="job_title" name="job_title" required autocomplete="organization-title" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
							<div>
								<label for="employment_duration" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How Long Employed?</label>
								<input type="text" id="employment_duration" name="employment_duration" autocomplete="off" placeholder="e.g. 3 years" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
						</div>

						<div>
							<label for="monthly_income" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Gross Income ($) <span class="text-red-500">*</span></label>
							<input type="number" id="monthly_income" name="monthly_income" required autocomplete="off" step="0.01" min="0" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
						</div>

						<div class="grid sm:grid-cols-2 gap-4">
							<div>
								<label for="additional_income" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Monthly Income ($)</label>
								<input type="number" id="additional_income" name="additional_income" autocomplete="off" step="0.01" min="0" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
							<div>
								<label for="additional_income_source" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source of Additional Income</label>
								<input type="text" id="additional_income_source" name="additional_income_source" autocomplete="off" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
							</div>
						</div>
					</div>
				</div>

				<!-- Step 5: Occupants, Pets & Vehicles -->
				<div data-step="5" class={currentStep === 5 ? '' : 'hidden'}>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Occupants, Pets & Vehicles</h2>

						<div>
							<label for="num_occupants" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Occupants (including yourself) <span class="text-red-500">*</span></label>
							<input type="number" id="num_occupants" name="num_occupants" required value="1" min="1" max="10" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
						</div>

						<div>
							<label for="occupant_names" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Names & Ages of All Other Occupants</label>
							<textarea id="occupant_names" name="occupant_names" rows="2" placeholder="e.g. Jane Doe, 28; John Doe Jr, 5" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-y placeholder:text-gray-400 dark:placeholder:text-gray-500"></textarea>
						</div>

						<div class="border-t border-gray-200 dark:border-gray-600 pt-4">
							<label class="flex items-center gap-3 cursor-pointer">
								<input type="checkbox" name="has_pets" bind:checked={hasPets} class="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
								<span class="text-sm font-medium text-gray-700 dark:text-gray-300">I have pets</span>
							</label>

							{#if hasPets}
								<div class="mt-3">
									<label for="pet_details" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pet Details (type, breed, weight)</label>
									<textarea id="pet_details" name="pet_details" rows="2" placeholder="e.g. Dog, Golden Retriever, 60 lbs" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-y placeholder:text-gray-400 dark:placeholder:text-gray-500"></textarea>
								</div>
							{/if}
						</div>

						<div class="border-t border-gray-200 dark:border-gray-600 pt-4">
							<label class="flex items-center gap-3 cursor-pointer">
								<input type="checkbox" name="has_vehicles" bind:checked={hasVehicles} class="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
								<span class="text-sm font-medium text-gray-700 dark:text-gray-300">I have more than 1 vehicle</span>
							</label>

							{#if hasVehicles}
								<div class="mt-3 space-y-3">
									<div>
										<label for="num_vehicles" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How many vehicles total?</label>
										<input type="number" id="num_vehicles" name="num_vehicles" min="2" max="10" value="2" autocomplete="off" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
									</div>
									<div>
										<label for="vehicle_details" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Details (year, make, model, plate)</label>
										<textarea id="vehicle_details" name="vehicle_details" rows="3" placeholder="e.g. 2020 Honda Civic, ABC-1234&#10;2018 Toyota Camry, XYZ-5678" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-y placeholder:text-gray-400 dark:placeholder:text-gray-500"></textarea>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Step 6: Background & References -->
				<div data-step="6" class={currentStep === 6 ? '' : 'hidden'}>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Background Questions</h2>

						<div>
							<label class="flex items-center gap-3 cursor-pointer">
								<input type="checkbox" name="has_felony" bind:checked={hasFelony} class="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
								<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Have you ever been convicted of a felony?</span>
							</label>

							{#if hasFelony}
								<div class="mt-3">
									<label for="felony_details" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Please explain</label>
									<textarea id="felony_details" name="felony_details" rows="2" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-y"></textarea>
								</div>
							{/if}
						</div>

						<div class="border-t border-gray-200 dark:border-gray-600 pt-4">
							<label class="flex items-center gap-3 cursor-pointer">
								<input type="checkbox" name="has_eviction" bind:checked={hasEviction} class="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
								<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Have you ever been evicted or broken a lease?</span>
							</label>

							{#if hasEviction}
								<div class="mt-3">
									<label for="eviction_details" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Please explain</label>
									<textarea id="eviction_details" name="eviction_details" rows="2" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-y"></textarea>
								</div>
							{/if}
						</div>
					</div>

					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5 mt-6">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal References</h2>
						<p class="text-sm text-gray-500 dark:text-gray-400">Please provide two personal references (not relatives).</p>

						<div class="space-y-4">
							<h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400">Reference 1</h3>
							<div class="grid sm:grid-cols-3 gap-4">
								<div>
									<label for="reference1_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name <span class="text-red-500">*</span></label>
									<input type="text" id="reference1_name" name="reference1_name" required autocomplete="off" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
								</div>
								<div>
									<label for="reference1_phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone <span class="text-red-500">*</span></label>
									<input type="tel" id="reference1_phone" name="reference1_phone" required autocomplete="off" data-phone placeholder="5085551234" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
								</div>
								<div>
									<label for="reference1_relationship" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relationship <span class="text-red-500">*</span></label>
									<input type="text" id="reference1_relationship" name="reference1_relationship" required autocomplete="off" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
								</div>
							</div>
						</div>

						<div class="space-y-4 border-t border-gray-200 dark:border-gray-600 pt-4">
							<h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400">Reference 2</h3>
							<div class="grid sm:grid-cols-3 gap-4">
								<div>
									<label for="reference2_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
									<input type="text" id="reference2_name" name="reference2_name" autocomplete="off" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
								</div>
								<div>
									<label for="reference2_phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
									<input type="tel" id="reference2_phone" name="reference2_phone" autocomplete="off" data-phone placeholder="5085551234" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
								</div>
								<div>
									<label for="reference2_relationship" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relationship</label>
									<input type="text" id="reference2_relationship" name="reference2_relationship" autocomplete="off" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Step 7: Review & Submit -->
				<div data-step="7" class={currentStep === 7 ? '' : 'hidden'}>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Additional Comments</h2>

						<div>
							<label for="additional_comments" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anything else you'd like us to know?</label>
							<textarea id="additional_comments" name="additional_comments" rows="3" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-y placeholder:text-gray-400 dark:placeholder:text-gray-500"></textarea>
						</div>
					</div>

					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5 mt-6">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Authorization & Consent</h2>

						<div class="space-y-4">
							<label class="flex items-start gap-3 cursor-pointer">
								<input type="checkbox" name="consent_background_check" required class="w-4 h-4 mt-0.5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
								<span class="text-sm text-gray-700 dark:text-gray-300">I authorize 21 Tatman Street property management to conduct a background check, credit check, and verify the information provided in this application. <span class="text-red-500">*</span></span>
							</label>

							<label class="flex items-start gap-3 cursor-pointer">
								<input type="checkbox" name="consent_terms" required class="w-4 h-4 mt-0.5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
								<span class="text-sm text-gray-700 dark:text-gray-300">I certify that all information provided is true and accurate. I understand that false information may result in denial of my application or termination of my lease. <span class="text-red-500">*</span></span>
							</label>
						</div>

						<button
							type="submit"
							disabled={submitting}
							class="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50 mt-4"
						>
							{submitting ? 'Submitting Application...' : 'Submit Application'}
						</button>

						<p class="text-xs text-gray-400 dark:text-gray-500 text-center">Your information is kept confidential and used solely for the purpose of evaluating your rental application.</p>
					</div>
				</div>

				<!-- Navigation Buttons -->
				<div class="flex justify-between">
					{#if currentStep > 1}
						<button
							type="button"
							onclick={prevStep}
							class="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
						>
							Back
						</button>
					{:else}
						<div></div>
					{/if}

					{#if currentStep < totalSteps}
						<button
							type="button"
							onclick={nextStep}
							class="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-light)] transition-colors"
						>
							Continue
						</button>
					{/if}
				</div>
			</form>
		{/if}
	</div>

	<footer class="bg-gray-800 dark:bg-gray-950 text-gray-400 text-sm py-6 mt-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<p>21 Tatman Street, Worcester, MA</p>
			<p class="mt-1 text-gray-500">Questions? Email mail.cmyers@gmail.com</p>
		</div>
	</footer>
</div>

<style>
	:global(.field-invalid) {
		border-color: #ef4444 !important;
		box-shadow: 0 0 0 1px #ef4444 !important;
	}

	:global(.dark .field-invalid) {
		border-color: #f87171 !important;
		box-shadow: 0 0 0 1px #f87171 !important;
	}
</style>
