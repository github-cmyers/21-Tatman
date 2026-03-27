<script lang="ts">
	import { enhance } from '$app/forms';

	let { form, data } = $props();

	let urgency = $state('normal');
	let submitted = $state(false);
	let submitting = $state(false);
	let expandedRequest = $state<number | null>(null);

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
		pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
		in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
		completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
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
	<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Maintenance Request</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-8">Submit a maintenance request and we'll get back to you as soon as possible.</p>

	{#if submitted}
		<div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
			<div class="text-4xl mb-4">&#10003;</div>
			<h2 class="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Request Submitted</h2>
			<p class="text-green-700 dark:text-green-400 mb-6">
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
				<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
					<p class="text-red-800 dark:text-red-400 text-sm font-medium">{form.error}</p>
				</div>
			{/if}

			<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
				<h2 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">Submitting as</h2>
				<div class="text-sm text-gray-700 dark:text-gray-300">
					<span class="font-medium">{tenant?.name}</span> &middot; Unit {tenant?.unit}
				</div>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
				<h2 class="font-semibold text-gray-900 dark:text-gray-100">Issue Details</h2>

				<div class="grid sm:grid-cols-2 gap-4">
					<div>
						<label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
						<select
							id="category"
							name="category"
							required
							class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
						>
							<option value="">Select category</option>
							{#each categories as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>
					<div>
						<label for="urgency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Urgency</label>
						<select
							id="urgency"
							name="urgency"
							bind:value={urgency}
							class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
						>
							<option value="low">Low - Can wait a few days</option>
							<option value="normal">Normal - Within 48 hours</option>
							<option value="high">High - Needs prompt attention</option>
							<option value="emergency">Emergency - Safety hazard</option>
						</select>
					</div>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Describe the Issue
					</label>
					<textarea
						id="description"
						name="description"
						required
						rows="5"
						placeholder="Please describe the issue in detail. Include the specific location within your unit (e.g., kitchen sink, bedroom window)."
						class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-y placeholder:text-gray-400 dark:placeholder:text-gray-500"
					></textarea>
				</div>

				<div>
					<label for="preferredTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Preferred Service Time (optional)
					</label>
					<input
						id="preferredTime"
						name="preferredTime"
						type="text"
						placeholder="e.g., Weekday mornings, Saturday afternoon"
						class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
					/>
				</div>
			</div>

			{#if urgency === 'emergency'}
				<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
					<p class="text-red-800 dark:text-red-400 text-sm font-medium">
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
			<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">My Requests</h2>
			<div class="space-y-3">
				{#each data.requests as req}
					<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
						<div class="p-5">
							<div class="flex items-start justify-between gap-3">
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2 mb-1">
										<span class="font-medium text-gray-900 dark:text-gray-100">{req.category}</span>
										<span class="px-2 py-0.5 rounded-full text-xs font-medium {statusColors[req.status] ?? ''}">{statusLabels[req.status] ?? req.status}</span>
									</div>
									<p class="text-sm text-gray-600 dark:text-gray-400">{req.description}</p>
									<p class="text-xs text-gray-400 mt-2">Submitted {new Date(req.created_at).toLocaleDateString()}</p>
								</div>
								<button
									onclick={() => expandedRequest = expandedRequest === req.id ? null : req.id}
									class="text-sm text-[var(--color-primary)] dark:text-blue-400 hover:underline shrink-0"
								>
									{expandedRequest === req.id ? 'Hide' : `Comments${data.comments[req.id]?.length ? ` (${data.comments[req.id].length})` : ''}`}
								</button>
							</div>
						</div>

						{#if expandedRequest === req.id}
							<div class="border-t border-gray-100 dark:border-gray-700 p-5 space-y-3">
								<!-- Existing comments -->
								{#if data.comments[req.id]?.length}
									<div class="space-y-2">
										{#each data.comments[req.id] as c}
											<div class="flex gap-3">
												<div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 {c.is_admin ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}">
													{c.author_name.charAt(0)}
												</div>
												<div class="flex-1 min-w-0">
													<div class="flex items-baseline gap-2">
														<span class="text-sm font-medium text-gray-900 dark:text-gray-100">{c.author_name}</span>
														{#if c.is_admin}
															<span class="text-xs text-[var(--color-primary)] font-medium">Admin</span>
														{/if}
														<span class="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
													</div>
													<p class="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{c.comment}</p>
												</div>
											</div>
										{/each}
									</div>
								{:else}
									<p class="text-sm text-gray-400">No comments yet.</p>
								{/if}

								<!-- Add comment form -->
								<form method="POST" action="?/addComment" use:enhance class="flex gap-2 mt-3">
									<input type="hidden" name="request_id" value={req.id} />
									<input
										name="comment"
										type="text"
										required
										placeholder="Add a comment..."
										class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
									/>
									<button
										type="submit"
										class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors shrink-0"
									>
										Send
									</button>
								</form>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>
