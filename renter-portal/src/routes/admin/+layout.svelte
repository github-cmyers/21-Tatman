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
		<h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
		<a href="/" class="text-sm text-[var(--color-primary)] hover:underline">&larr; Back to Portal</a>
	</div>

	<nav class="flex gap-1 mb-8 border-b border-gray-200 overflow-x-auto">
		{#each adminLinks as link}
			<a
				href={link.href}
				class="px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors hover:text-[var(--color-primary)] border-transparent text-gray-600"
			>
				{link.label}
			</a>
		{/each}
	</nav>

	{@render children()}
</div>
