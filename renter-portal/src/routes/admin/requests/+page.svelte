<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	const urgencyColors: Record<string, string> = {
		low: 'bg-gray-100 text-gray-700',
		normal: 'bg-blue-100 text-blue-700',
		high: 'bg-orange-100 text-orange-700',
		emergency: 'bg-red-100 text-red-700'
	};

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800',
		in_progress: 'bg-blue-100 text-blue-800',
		completed: 'bg-green-100 text-green-800'
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
				: 'bg-white text-gray-700 border border-gray-200 hover:border-[var(--color-primary)]'}"
		>
			{f.label}
		</a>
	{/each}
</div>

{#if data.requests.length === 0}
	<div class="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center text-gray-500">
		No requests found.
	</div>
{:else}
	<div class="space-y-4">
		{#each data.requests as req}
			<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
				<div class="flex flex-wrap items-start justify-between gap-4">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-1">
							<span class="font-semibold text-gray-900">Unit {req.unit}</span>
							<span class="text-gray-400">&middot;</span>
							<span class="text-gray-600">{req.name}</span>
							{#if req.phone}
								<span class="text-gray-400">&middot;</span>
								<span class="text-gray-500 text-sm">{req.phone}</span>
							{/if}
						</div>
						<div class="flex items-center gap-2 mb-2">
							<span class="px-2 py-0.5 rounded-full text-xs font-medium {urgencyColors[req.urgency] ?? ''}">{req.urgency}</span>
							<span class="px-2 py-0.5 rounded-full text-xs font-medium {statusColors[req.status] ?? ''}">{req.status.replace('_', ' ')}</span>
							<span class="text-xs text-gray-400">{req.category}</span>
						</div>
						<p class="text-sm text-gray-700">{req.description}</p>
						{#if req.preferred_time}
							<p class="text-xs text-gray-500 mt-1">Preferred time: {req.preferred_time}</p>
						{/if}
						<p class="text-xs text-gray-400 mt-2">
							Submitted {new Date(req.created_at).toLocaleString()}
							{#if req.updated_at !== req.created_at}
								&middot; Updated {new Date(req.updated_at).toLocaleString()}
							{/if}
						</p>
					</div>

					<form method="POST" action="?/updateStatus" use:enhance class="flex items-center gap-2 shrink-0">
						<input type="hidden" name="id" value={req.id} />
						<select
							name="status"
							class="text-sm rounded-lg border border-gray-300 px-2 py-1.5 focus:border-[var(--color-primary)] outline-none"
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
		{/each}
	</div>
{/if}
