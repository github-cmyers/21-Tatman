<script lang="ts">
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
</script>

<svelte:head>
	<title>Admin - 21 Tatman</title>
</svelte:head>

<!-- Stats -->
<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
	<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
		<h3 class="text-sm font-medium text-gray-500 uppercase">Pending Requests</h3>
		<p class="text-3xl font-bold text-yellow-600 mt-1">{data.requestStats.pending}</p>
	</div>
	<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
		<h3 class="text-sm font-medium text-gray-500 uppercase">In Progress</h3>
		<p class="text-3xl font-bold text-blue-600 mt-1">{data.requestStats.in_progress}</p>
	</div>
	<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
		<h3 class="text-sm font-medium text-gray-500 uppercase">Unread Messages</h3>
		<p class="text-3xl font-bold text-orange-600 mt-1">{data.messageStats.unread}</p>
	</div>
	<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
		<h3 class="text-sm font-medium text-gray-500 uppercase">Tenants</h3>
		<p class="text-3xl font-bold text-gray-900 mt-1">{data.tenantStats.total}</p>
	</div>
</div>

<!-- Recent Requests -->
<div class="bg-white rounded-xl shadow-sm border border-gray-100">
	<div class="p-5 border-b border-gray-100 flex items-center justify-between">
		<h2 class="font-semibold text-gray-900">Recent Maintenance Requests</h2>
		<a href="/admin/requests" class="text-sm text-[var(--color-primary)] hover:underline">View all</a>
	</div>
	{#if data.recentRequests.length === 0}
		<div class="p-8 text-center text-gray-500">No maintenance requests yet.</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-gray-50 text-gray-600 text-xs uppercase">
					<tr>
						<th class="px-5 py-3 text-left">Unit</th>
						<th class="px-5 py-3 text-left">Tenant</th>
						<th class="px-5 py-3 text-left">Category</th>
						<th class="px-5 py-3 text-left">Urgency</th>
						<th class="px-5 py-3 text-left">Status</th>
						<th class="px-5 py-3 text-left">Date</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each data.recentRequests as req}
						<tr class="hover:bg-gray-50">
							<td class="px-5 py-3 font-medium">Unit {req.unit}</td>
							<td class="px-5 py-3">{req.name}</td>
							<td class="px-5 py-3">{req.category}</td>
							<td class="px-5 py-3">
								<span class="px-2 py-0.5 rounded-full text-xs font-medium {urgencyColors[req.urgency] ?? ''}">{req.urgency}</span>
							</td>
							<td class="px-5 py-3">
								<span class="px-2 py-0.5 rounded-full text-xs font-medium {statusColors[req.status] ?? ''}">{req.status.replace('_', ' ')}</span>
							</td>
							<td class="px-5 py-3 text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
