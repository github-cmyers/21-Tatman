<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
	let expandedRequest = $state<number | null>(null);

	const urgencyColors: Record<string, string> = {
		low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
		normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
		high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
		emergency: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
	};

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
		in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
		completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
	};

	const filters = [
		{ value: 'all', label: 'All' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'in_progress', label: 'In Progress' },
		{ value: 'completed', label: 'Completed' }
	];
</script>

<svelte:head>
	<title>Requests - Admin</title>
</svelte:head>

<!-- Filters -->
<div class="flex gap-2 mb-6">
	{#each filters as f}
		<a
			href="/admin/requests{f.value === 'all' ? '' : `?status=${f.value}`}"
			class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {data.statusFilter === f.value
				? 'bg-[var(--color-primary)] text-white'
				: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[var(--color-primary)]'}"
		>
			{f.label}
		</a>
	{/each}
</div>

{#if data.requests.length === 0}
	<div class="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
		No requests found.
	</div>
{:else}
	<div class="space-y-4">
		{#each data.requests as req}
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="p-5">
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<span class="font-semibold text-gray-900 dark:text-gray-100">Unit {req.unit}</span>
								<span class="text-gray-400">&middot;</span>
								<span class="text-gray-600 dark:text-gray-400">{req.name}</span>
								{#if req.phone}
									<span class="text-gray-400">&middot;</span>
									<span class="text-gray-500 dark:text-gray-400 text-sm">{req.phone}</span>
								{/if}
							</div>
							<div class="flex items-center gap-2 mb-2">
								<span class="px-2 py-0.5 rounded-full text-xs font-medium {urgencyColors[req.urgency] ?? ''}">{req.urgency}</span>
								<span class="px-2 py-0.5 rounded-full text-xs font-medium {statusColors[req.status] ?? ''}">{req.status.replace('_', ' ')}</span>
								<span class="text-xs text-gray-400">{req.category}</span>
							</div>
							<p class="text-sm text-gray-700 dark:text-gray-300">{req.description}</p>
							{#if req.preferred_time}
								<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Preferred time: {req.preferred_time}</p>
							{/if}
							<p class="text-xs text-gray-400 mt-2">
								Submitted {new Date(req.created_at).toLocaleString()}
								{#if req.updated_at !== req.created_at}
									&middot; Updated {new Date(req.updated_at).toLocaleString()}
								{/if}
							</p>
						</div>

						<div class="flex items-center gap-2 shrink-0">
							<button
								onclick={() => expandedRequest = expandedRequest === req.id ? null : req.id}
								class="text-sm text-[var(--color-primary)] dark:text-blue-400 hover:underline"
							>
								{expandedRequest === req.id ? 'Hide' : `Comments${data.comments[req.id]?.length ? ` (${data.comments[req.id].length})` : ''}`}
							</button>
							<form method="POST" action="?/updateStatus" use:enhance class="flex items-center gap-2">
								<input type="hidden" name="id" value={req.id} />
								<select
									name="status"
									class="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1.5 focus:border-[var(--color-primary)] outline-none"
								>
									<option value="pending" selected={req.status === 'pending'}>Pending</option>
									<option value="in_progress" selected={req.status === 'in_progress'}>In Progress</option>
									<option value="completed" selected={req.status === 'completed'}>Completed</option>
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

				<!-- Comments section -->
				{#if expandedRequest === req.id}
					<div class="border-t border-gray-100 dark:border-gray-700 p-5 space-y-3">
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

						<form method="POST" action="?/addComment" use:enhance class="flex gap-2 mt-3">
							<input type="hidden" name="request_id" value={req.id} />
							<input
								name="comment"
								type="text"
								required
								placeholder="Add an admin note or reply..."
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
{/if}
