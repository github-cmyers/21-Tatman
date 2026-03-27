<script lang="ts">
	let { data } = $props();

	const tenant = $derived(data.tenant);

	const floorNames: Record<string, string> = {
		'1': '1st Floor',
		'2': '2nd Floor',
		'3': '3rd Floor'
	};

	const announcements = [
		{
			date: 'March 2026',
			title: 'Welcome New Owners',
			body: 'We are excited to welcome you to 21 Tatman Street! We are committed to maintaining a safe and comfortable living environment for all tenants.'
		},
		{
			date: 'Spring 2026',
			title: 'Scheduled Maintenance',
			body: 'Front porch repairs, walkway concrete repairs, and exterior painting will be scheduled for spring. We will notify you in advance of any work affecting your unit.'
		}
	];

	const quickLinks = [
		{
			href: '/maintenance',
			title: 'Submit Request',
			description: 'Report a maintenance issue',
			icon: '🔧'
		},
		{
			href: '/units',
			title: 'My Unit',
			description: 'View unit details & amenities',
			icon: '🏠'
		},
		{
			href: '/property',
			title: 'Property Info',
			description: 'Shutoffs, systems & emergency info',
			icon: '📋'
		},
		{
			href: '/contact',
			title: 'Contact',
			description: 'Reach your property manager',
			icon: '📞'
		}
	];
</script>

<svelte:head>
	<title>Home - 21 Tatman Renter Portal</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Hero -->
	<div class="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-2xl p-8 md:p-12 text-white mb-8">
		<h1 class="text-3xl md:text-4xl font-bold mb-3">Welcome, {tenant?.name?.split(' ')[0]}</h1>
		<p class="text-blue-100 text-lg max-w-2xl">
			Unit {tenant?.unit} &middot; {floorNames[tenant?.unit ?? '1']} &middot; 21 Tatman Street, Worcester, MA
		</p>
	</div>

	<!-- Quick Links -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		{#each quickLinks as link}
			<a
				href={link.href}
				class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-[var(--color-accent)] transition-all group"
			>
				<div class="text-3xl mb-3">{link.icon}</div>
				<h3 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-accent)]">{link.title}</h3>
				<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{link.description}</p>
			</a>
		{/each}
	</div>

	<!-- Announcements -->
	<section>
		<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Announcements</h2>
		<div class="space-y-4">
			{#each announcements as item}
				<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
					<div class="flex items-start justify-between gap-4">
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
							<p class="text-gray-600 dark:text-gray-300 mt-1">{item.body}</p>
						</div>
						<span class="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
