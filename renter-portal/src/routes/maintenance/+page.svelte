<script lang="ts">
	import { enhance } from '$app/forms';

	let { form, data } = $props();

	let urgency = $state('normal');
	let submitted = $state(false);
	let submitting = $state(false);

	const tenant = $derived(data.tenant);

	const categories = [
		'Plumbing',
		'Electrical',
		'Heating / Cooling',
		'Appliance',
		'Pest Control',
		'Doors / Windows',
		'Walls / Ceiling / Floor',
		'Exterior / Common Area',
		'Other'
	];

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800',
		in_progress: 'bg-blue-100 text-blue-800',
		completed: 'bg-green-100 text-green-800'
	};

	const statusLabels: Record<string, string> = {
		pending: 'Pending',
		in_progress: 'In Progress',
		completed: 'Completed'
	};

	function resetForm() {
		submitted = false;
	}
</script>

<svelte:head>
	<title>Maintenance Request - 21 Tatman</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-2xl font-bold text-gray-900 mb-2">Maintenance Request</h1>
	<p class="text-gray-600 mb-8">Submit a maintenance request and we'll get back to you as soon as possible.</p>

	{#if submitted}
		<div class="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
			<div class="text-4xl mb-4">&#10003;</div>
			<h2 class="text-xl font-semibold text-green-800 mb-2">Request Submitted</h2>
			<p class="text-green-700 mb-6">
				Thank you! We've received your maintenance request and will respond within 24-48 hours.
				For urgent issues, please call your property manager directly.
			</p>
			<button
				onclick={resetForm}
				class="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
			>
				Submit Another Request
			</button>
		</div>
	{:else}
		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					submitting = false;
					if (result.type === 'success') {
						submitted = true;
					} else {
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			{#if form?.error}
				<div class="bg-red-50 border border-red-200 rounded-xl p-4">
					<p class="text-red-800 text-sm font-medium">{form.error}</p>
				</div>
			{/if}

			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h2 class="font-semibold text-gray-900 mb-3">Submitting as</h2>
				<div class="text-sm text-gray-700">
					<span class="font-medium">{tenant?.name}</span> &middot; Unit {tenant?.unit}
				</div>
			</div>

			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
				<h2 class="font-semibold text-gray-900">Issue Details</h2>

				<div class="grid sm:grid-cols-2 gap-4">
					<div>
						<label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
						<select
							id="category"
							name="category"
							required
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
						>
							<option value="">Select category</option>
							{#each categories as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>
					<div>
						<label for="urgency" class="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
						<select
							id="urgency"
							name="urgency"
							bind:value={urgency}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
						>
							<option value="low">Low - Can wait a few days</option>
							<option value="normal">Normal - Within 48 hours</option>
							<option value="high">High - Needs prompt attention</option>
							<option value="emergency">Emergency - Safety hazard</option>
						</select>
					</div>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
						Describe the Issue
					</label>
					<textarea
						id="description"
						name="description"
						required
						rows="5"
						placeholder="Please describe the issue in detail. Include the specific location within your unit (e.g., kitchen sink, bedroom window)."
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-y"
					></textarea>
				</div>

				<div>
					<label for="preferredTime" class="block text-sm font-medium text-gray-700 mb-1">
						Preferred Service Time (optional)
					</label>
					<input
						id="preferredTime"
						name="preferredTime"
						type="text"
						placeholder="e.g., Weekday mornings, Saturday afternoon"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
					/>
				</div>
			</div>

			{#if urgency === 'emergency'}
				<div class="bg-red-50 border border-red-200 rounded-xl p-4">
					<p class="text-red-800 text-sm font-medium">
						For true emergencies (fire, gas leak, flooding), call 911 first, then contact your property manager immediately.
					</p>
				</div>
			{/if}

			<button
				type="submit"
				disabled={submitting}
				class="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
			>
				{submitting ? 'Submitting...' : 'Submit Maintenance Request'}
			</button>
		</form>
	{/if}

	<!-- My Requests -->
	{#if data.requests.length > 0}
		<section class="mt-10">
			<h2 class="text-xl font-bold text-gray-900 mb-4">My Requests</h2>
			<div class="space-y-3">
				{#each data.requests as req}
					<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
						<div class="flex items-start justify-between gap-3">
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-1">
									<span class="font-medium text-gray-900">{req.category}</span>
									<span class="px-2 py-0.5 rounded-full text-xs font-medium {statusColors[req.status] ?? ''}">{statusLabels[req.status] ?? req.status}</span>
								</div>
								<p class="text-sm text-gray-600">{req.description}</p>
								<p class="text-xs text-gray-400 mt-2">Submitted {new Date(req.created_at).toLocaleDateString()}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>
