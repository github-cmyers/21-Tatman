<script lang="ts">
	let { children } = $props();

	const adminLinks = [
		{ href: '/admin', label: 'Overview' },
		{ href: '/admin/requests', label: 'Requests' },
		{ href: '/admin/messages', label: 'Messages' },
		{ href: '/admin/tenants', label: 'Tenants' }
	];
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
		<a href="/" class="text-sm text-[var(--color-primary)] dark:text-blue-400 hover:underline">&larr; Back to Portal</a>
	</div>

	<nav class="flex gap-1 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
		{#each adminLinks as link}
			<a
				href={link.href}
				class="px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors hover:text-[var(--color-primary)] dark:hover:text-blue-400 border-transparent text-gray-600 dark:text-gray-400"
			>
				{link.label}
			</a>
		{/each}
	</nav>

	{@render children()}
</div>
