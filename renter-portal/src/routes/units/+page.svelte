<script lang="ts">
	let { data } = $props();

	const tenant = $derived(data.tenant);

	const units: Record<string, {
		name: string;
		floor: string;
		bedrooms: number;
		bathrooms: number;
		rooms: { name: string; details: string }[];
		features: string[];
		waterHeater: string;
	}> = {
		'1': {
			name: 'Unit 1',
			floor: '1st Floor',
			bedrooms: 2,
			bathrooms: 1,
			rooms: [
				{ name: 'Living Room', details: 'Ceiling fan, heating source' },
				{ name: 'Kitchen', details: 'Full appliances: oven, range, dishwasher, microwave, refrigerator, exhaust fan. GFCI outlets.' },
				{ name: 'Bathroom', details: 'Tub/shower combo, exhaust fan, GFCI outlets' },
				{ name: 'Bedroom 1', details: 'Ceiling fan, heating source, egress window' },
				{ name: 'Bedroom 2', details: 'Heating source' }
			],
			features: ['Vinyl windows', 'Front porch access', 'Individual heating', 'Ceiling fans in living room & bedrooms'],
			waterHeater: 'Gas, 40 gallon',
		},
		'2': {
			name: 'Unit 2',
			floor: '2nd Floor',
			bedrooms: 2,
			bathrooms: 1,
			rooms: [
				{ name: 'Living Room', details: 'Ceiling fan, heating source' },
				{ name: 'Kitchen', details: 'Full appliances: oven, range, dishwasher, microwave, refrigerator, exhaust fan. GFCI outlets.' },
				{ name: 'Bathroom', details: 'Tub/shower combo, exhaust fan, GFCI outlets' },
				{ name: 'Bedroom 1', details: 'Ceiling fan, heating source, egress window' },
				{ name: 'Bedroom 2', details: 'Ceiling fan, heating source, egress window' }
			],
			features: ['Vinyl windows', 'Side porch access', 'Individual heating', 'Ceiling fans in living room & bedrooms'],
			waterHeater: 'Gas, 40 gallon',
		},
		'3': {
			name: 'Unit 3',
			floor: '3rd Floor',
			bedrooms: 2,
			bathrooms: 1,
			rooms: [
				{ name: 'Living Room', details: 'Ceiling fan, heating source' },
				{ name: 'Kitchen', details: 'Oven and range. No dishwasher, microwave, or refrigerator provided.' },
				{ name: 'Bathroom', details: 'Tub/shower combo, exhaust fan, GFCI outlets' },
				{ name: 'Bedroom 1', details: 'Ceiling fan, heating source, egress window' },
				{ name: 'Bedroom 2', details: 'Ceiling fan, heating source, egress window' }
			],
			features: ['Vinyl windows', 'Individual heating', 'Ceiling fans in living room & bedrooms'],
			waterHeater: 'Electric, 40 gallon',
		}
	};

	const myUnit = $derived(units[tenant?.unit ?? '1']);
</script>

<svelte:head>
	<title>My Unit - 21 Tatman</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Unit</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-6">{myUnit.name} &middot; {myUnit.floor}</p>

	<!-- Unit Overview -->
	<div class="grid sm:grid-cols-3 gap-4 mb-6">
		<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
			<div class="text-3xl mb-1">🛏️</div>
			<div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{myUnit.bedrooms}</div>
			<div class="text-sm text-gray-500 dark:text-gray-400">Bedrooms</div>
		</div>
		<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
			<div class="text-3xl mb-1">🚿</div>
			<div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{myUnit.bathrooms}</div>
			<div class="text-sm text-gray-500 dark:text-gray-400">Bathroom</div>
		</div>
		<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
			<div class="text-3xl mb-1">📍</div>
			<div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{myUnit.floor}</div>
			<div class="text-sm text-gray-500 dark:text-gray-400">Location</div>
		</div>
	</div>

	<!-- Rooms -->
	<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
		<div class="p-6 border-b border-gray-100 dark:border-gray-700">
			<h2 class="font-semibold text-gray-900 dark:text-gray-100">Rooms</h2>
		</div>
		<div class="divide-y divide-gray-100 dark:divide-gray-700">
			{#each myUnit.rooms as room}
				<div class="p-4 px-6">
					<h3 class="font-medium text-gray-900 dark:text-gray-100">{room.name}</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{room.details}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Features & Systems -->
	<div class="grid md:grid-cols-2 gap-6">
		<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
			<h2 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">Features</h2>
			<ul class="space-y-2">
				{#each myUnit.features as feature}
					<li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
						<span class="text-green-500 mt-0.5">&#10003;</span>
						{feature}
					</li>
				{/each}
			</ul>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
			<h2 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">Systems</h2>
			<dl class="space-y-3">
				<div>
					<dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Water Heater</dt>
					<dd class="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{myUnit.waterHeater}</dd>
				</div>
			</dl>
		</div>
	</div>
</div>
