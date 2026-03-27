<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children, data } = $props();

	let mobileMenuOpen = $state(false);

	const tenant = $derived(data.tenant);

	const navLinks = $derived([
		{ href: '/', label: 'Home' },
		{ href: '/units', label: 'My Unit' },
		{ href: '/maintenance', label: 'Maintenance' },
		{ href: '/property', label: 'Property Info' },
		{ href: '/contact', label: 'Contact' },
		...(tenant?.isAdmin ? [{ href: '/admin', label: 'Admin' }] : [])
	]);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>21 Tatman - Renter Portal</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col">
	{#if tenant}
		<header class="bg-[var(--color-primary)] text-white shadow-lg">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between h-16">
					<a href="/" class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-lg bg-[var(--color-accent)] flex items-center justify-center font-bold text-[var(--color-primary)] text-lg">
							21
						</div>
						<div>
							<div class="font-semibold text-lg leading-tight">21 Tatman St</div>
							<div class="text-xs text-blue-200">Renter Portal</div>
						</div>
					</a>

					<nav class="hidden md:flex items-center gap-1">
						{#each navLinks as link}
							<a
								href={link.href}
								class="px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors"
							>
								{link.label}
							</a>
						{/each}
					</nav>

					<div class="hidden md:flex items-center gap-3">
						<div class="text-right text-sm">
							<div class="font-medium">{tenant.name}</div>
							<div class="text-xs text-blue-200">Unit {tenant.unit}</div>
						</div>
						<form method="POST" action="/logout">
							<button
								type="submit"
								class="px-3 py-1.5 rounded-md text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
							>
								Sign Out
							</button>
						</form>
					</div>

					<button
						class="md:hidden p-2 rounded-md hover:bg-[var(--color-primary-light)]"
						onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{#if mobileMenuOpen}
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							{:else}
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							{/if}
						</svg>
					</button>
				</div>
			</div>

			{#if mobileMenuOpen}
				<nav class="md:hidden border-t border-blue-400/30 px-4 py-2">
					{#each navLinks as link}
						<a
							href={link.href}
							class="block px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--color-primary-light)]"
							onclick={() => (mobileMenuOpen = false)}
						>
							{link.label}
						</a>
					{/each}
					<div class="border-t border-blue-400/30 mt-2 pt-2 px-3 py-2">
						<div class="text-sm font-medium">{tenant.name} &middot; Unit {tenant.unit}</div>
						<form method="POST" action="/logout" class="mt-2">
							<button
								type="submit"
								class="text-sm text-blue-200 hover:text-white"
							>
								Sign Out
							</button>
						</form>
					</div>
				</nav>
			{/if}
		</header>
	{/if}

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="bg-gray-800 text-gray-400 text-sm py-6">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<p>21 Tatman Street, Worcester, MA &middot; Renter Portal</p>
			<p class="mt-1 text-gray-500">For emergencies, call 911. For urgent property issues, contact your landlord directly.</p>
		</div>
	</footer>
</div>
