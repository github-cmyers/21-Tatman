<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	let expandedId = $state<number | null>(null);

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
		reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
		approved: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
		rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
	};

	const filters = [
		{ value: 'all', label: 'All' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'reviewed', label: 'Reviewed' },
		{ value: 'approved', label: 'Approved' },
		{ value: 'rejected', label: 'Rejected' }
	];

	function toggleExpand(id: number) {
		expandedId = expandedId === id ? null : id;
	}

	function formatDate(d: string | null) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString();
	}

	function formatCurrency(val: string | number | null) {
		if (val == null) return '—';
		return `$${Number(val).toLocaleString()}`;
	}
</script>

<svelte:head>
	<title>Applications - Admin</title>
</svelte:head>

<!-- Filters -->
<div class="flex gap-2 mb-6">
	{#each filters as f}
		<a
			href="/admin/applications{f.value === 'all' ? '' : `?status=${f.value}`}"
			class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {data.statusFilter === f.value
				? 'bg-[var(--color-primary)] text-white'
				: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[var(--color-primary)]'}"
		>
			{f.label}
		</a>
	{/each}
</div>

{#if data.applications.length === 0}
	<div class="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
		No applications found.
	</div>
{:else}
	<div class="space-y-4">
		{#each data.applications as app}
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
				<!-- Summary row -->
				<div class="p-5">
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<span class="font-semibold text-gray-900 dark:text-gray-100">
									{app.applicant_first_name} {app.applicant_last_name}
								</span>
								<span class="px-2 py-0.5 rounded-full text-xs font-medium {statusColors[app.status] ?? ''}">
									{app.status}
								</span>
							</div>
							<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
								<span>{app.applicant_email}</span>
								<span class="text-gray-400">&middot;</span>
								<span>{app.applicant_phone}</span>
								{#if app.desired_unit}
									<span class="text-gray-400">&middot;</span>
									<span>Unit {app.desired_unit}</span>
								{/if}
								{#if app.desired_move_in}
									<span class="text-gray-400">&middot;</span>
									<span>Move-in: {formatDate(app.desired_move_in)}</span>
								{/if}
							</div>
							<p class="text-xs text-gray-400 mt-2">
								Applied {new Date(app.created_at).toLocaleString()}
							</p>
						</div>

						<div class="flex items-center gap-2 shrink-0">
							<button
								onclick={() => toggleExpand(app.id)}
								class="text-sm text-[var(--color-primary)] dark:text-blue-400 hover:underline"
							>
								{expandedId === app.id ? 'Hide Details' : 'View Details'}
							</button>

							<form method="POST" action="?/updateStatus" use:enhance class="flex items-center gap-2">
								<input type="hidden" name="id" value={app.id} />
								<select
									name="status"
									class="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1.5 focus:border-[var(--color-primary)] outline-none"
								>
									<option value="pending" selected={app.status === 'pending'}>Pending</option>
									<option value="reviewed" selected={app.status === 'reviewed'}>Reviewed</option>
									<option value="approved" selected={app.status === 'approved'}>Approved</option>
									<option value="rejected" selected={app.status === 'rejected'}>Rejected</option>
								</select>
								<button
									type="submit"
									class="bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors"
								>
									Update
								</button>
							</form>
						</div>
					</div>
				</div>

				<!-- Expanded details -->
				{#if expandedId === app.id}
					<div class="border-t border-gray-100 dark:border-gray-700 p-5">
						<div class="grid md:grid-cols-2 gap-6">
							<!-- Personal Info -->
							<div>
								<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wide">Personal Info</h4>
								<dl class="space-y-2 text-sm">
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Name</dt><dd class="text-gray-900 dark:text-gray-100">{app.applicant_first_name} {app.applicant_last_name}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Email</dt><dd class="text-gray-900 dark:text-gray-100">{app.applicant_email}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Phone</dt><dd class="text-gray-900 dark:text-gray-100">{app.applicant_phone}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">DOB</dt><dd class="text-gray-900 dark:text-gray-100">{formatDate(app.date_of_birth)}</dd></div>
								</dl>
							</div>

							<!-- Move-in Details -->
							<div>
								<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wide">Move-in Details</h4>
								<dl class="space-y-2 text-sm">
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Desired Move-in</dt><dd class="text-gray-900 dark:text-gray-100">{formatDate(app.desired_move_in)}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Desired Unit</dt><dd class="text-gray-900 dark:text-gray-100">{app.desired_unit || '—'}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Lease Term</dt><dd class="text-gray-900 dark:text-gray-100">{app.lease_term || '—'}</dd></div>
								</dl>
							</div>

							<!-- Current Residence -->
							<div>
								<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wide">Current Residence</h4>
								<dl class="space-y-2 text-sm">
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Address</dt><dd class="text-gray-900 dark:text-gray-100 text-right">{app.current_address || '—'}{app.current_city ? `, ${app.current_city}` : ''}{app.current_state ? `, ${app.current_state}` : ''} {app.current_zip || ''}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Landlord</dt><dd class="text-gray-900 dark:text-gray-100">{app.current_landlord_name || '—'}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Landlord Phone</dt><dd class="text-gray-900 dark:text-gray-100">{app.current_landlord_phone || '—'}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Current Rent</dt><dd class="text-gray-900 dark:text-gray-100">{formatCurrency(app.current_rent)}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Duration</dt><dd class="text-gray-900 dark:text-gray-100">{app.current_residence_duration || '—'}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Reason for Leaving</dt><dd class="text-gray-900 dark:text-gray-100 text-right max-w-[200px]">{app.reason_for_leaving || '—'}</dd></div>
								</dl>
							</div>

							<!-- Employment -->
							<div>
								<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wide">Employment</h4>
								<dl class="space-y-2 text-sm">
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Employer</dt><dd class="text-gray-900 dark:text-gray-100">{app.employer_name || '—'}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Employer Phone</dt><dd class="text-gray-900 dark:text-gray-100">{app.employer_phone || '—'}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Job Title</dt><dd class="text-gray-900 dark:text-gray-100">{app.job_title || '—'}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Monthly Income</dt><dd class="text-gray-900 dark:text-gray-100">{formatCurrency(app.monthly_income)}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Duration</dt><dd class="text-gray-900 dark:text-gray-100">{app.employment_duration || '—'}</dd></div>
									{#if app.additional_income}
										<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Additional Income</dt><dd class="text-gray-900 dark:text-gray-100">{formatCurrency(app.additional_income)} ({app.additional_income_source || '—'})</dd></div>
									{/if}
								</dl>
							</div>

							<!-- Occupants & Pets -->
							<div>
								<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wide">Occupants & Pets</h4>
								<dl class="space-y-2 text-sm">
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Occupants</dt><dd class="text-gray-900 dark:text-gray-100">{app.num_occupants ?? 1}</dd></div>
									{#if app.occupant_names}
										<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Names</dt><dd class="text-gray-900 dark:text-gray-100 text-right max-w-[200px]">{app.occupant_names}</dd></div>
									{/if}
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Pets</dt><dd class="text-gray-900 dark:text-gray-100">{app.has_pets ? 'Yes' : 'No'}</dd></div>
									{#if app.has_pets && app.pet_details}
										<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Pet Details</dt><dd class="text-gray-900 dark:text-gray-100 text-right max-w-[200px]">{app.pet_details}</dd></div>
									{/if}
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Vehicles</dt><dd class="text-gray-900 dark:text-gray-100">{app.has_vehicles ? `Yes (${app.num_vehicles ?? 0})` : 'No'}</dd></div>
									{#if app.has_vehicles && app.vehicle_details}
										<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Vehicle Details</dt><dd class="text-gray-900 dark:text-gray-100 text-right max-w-[200px]">{app.vehicle_details}</dd></div>
									{/if}
								</dl>
							</div>

							<!-- Background -->
							<div>
								<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wide">Background & References</h4>
								<dl class="space-y-2 text-sm">
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Felony</dt><dd class="text-gray-900 dark:text-gray-100">{app.has_felony ? 'Yes' : 'No'}</dd></div>
									{#if app.has_felony && app.felony_details}
										<div><dd class="text-gray-600 dark:text-gray-400 text-sm">{app.felony_details}</dd></div>
									{/if}
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Eviction</dt><dd class="text-gray-900 dark:text-gray-100">{app.has_eviction ? 'Yes' : 'No'}</dd></div>
									{#if app.has_eviction && app.eviction_details}
										<div><dd class="text-gray-600 dark:text-gray-400 text-sm">{app.eviction_details}</dd></div>
									{/if}
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Emergency Contact</dt><dd class="text-gray-900 dark:text-gray-100">{app.emergency_contact_name || '—'} ({app.emergency_contact_relationship || '—'}) {app.emergency_contact_phone || ''}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Reference 1</dt><dd class="text-gray-900 dark:text-gray-100">{app.reference1_name || '—'} ({app.reference1_relationship || '—'}) {app.reference1_phone || ''}</dd></div>
									<div class="flex justify-between"><dt class="text-gray-500 dark:text-gray-400">Reference 2</dt><dd class="text-gray-900 dark:text-gray-100">{app.reference2_name || '—'} ({app.reference2_relationship || '—'}) {app.reference2_phone || ''}</dd></div>
								</dl>
							</div>
						</div>

						{#if app.additional_comments}
							<div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
								<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm uppercase tracking-wide">Additional Comments</h4>
								<p class="text-sm text-gray-700 dark:text-gray-300">{app.additional_comments}</p>
							</div>
						{/if}

						<div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-4 text-xs text-gray-400">
							<span>Background Check Consent: {app.consent_background_check ? 'Yes' : 'No'}</span>
							<span>Terms Accepted: {app.consent_terms ? 'Yes' : 'No'}</span>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}
