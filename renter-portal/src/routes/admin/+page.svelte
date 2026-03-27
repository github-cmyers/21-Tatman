<script lang="ts">
	let { data } = $props();

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
</script>

<svelte:head>
	<title>Admin - 21 Tatman</title>
</svelte:head>

<!-- Stats -->
<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
	<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
		<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Pending Requests</h3>
		<p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{data.requestStats.pending}</p>
	</div>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
		<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">In Progress</h3>
		<p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{data.requestStats.in_progress}</p>
	</div>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
		<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Unread Messages</h3>
		<p class="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">{data.messageStats.unread}</p>
	</div>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
		<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Tenants</h3>
		<p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{data.tenantStats.total}</p>
	</div>
</div>

<!-- Recent Requests -->
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
	<div class="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
		<h2 class="font-semibold text-gray-900 dark:text-gray-100">Recent Maintenance Requests</h2>
		<a href="/admin/requests" class="text-sm text-[var(--color-primary)] dark:text-blue-400 hover:underline">View all</a>
	</div>
	{#if data.recentRequests.length === 0}
		<div class="p-8 text-center text-gray-500 dark:text-gray-400">No maintenance requests yet.</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs uppercase">
					<tr>
						<th class="px-5 py-3 text-left">Unit</th>
						<th class="px-5 py-3 text-left">Tenant</th>
						<th class="px-5 py-3 text-left">Category</th>
						<th class="px-5 py-3 text-left">Urgency</th>
						<th class="px-5 py-3 text-left">Status</th>
						<th class="px-5 py-3 text-left">Date</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 dark:divide-gray-700">
					{#each data.recentRequests as req}
						<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30">
							<td class="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">Unit {req.unit}</td>
							<td class="px-5 py-3 text-gray-700 dark:text-gray-300">{req.name}</td>
							<td class="px-5 py-3 text-gray-700 dark:text-gray-300">{req.category}</td>
							<td class="px-5 py-3">
								<span class="px-2 py-0.5 rounded-full text-xs font-medium {urgencyColors[req.urgency] ?? ''}">{req.urgency}</span>
							</td>
							<td class="px-5 py-3">
								<span class="px-2 py-0.5 rounded-full text-xs font-medium {statusColors[req.status] ?? ''}">{req.status.replace('_', ' ')}</span>
							</td>
							<td class="px-5 py-3 text-gray-500 dark:text-gray-400">{new Date(req.created_at).toLocaleDateString()}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
