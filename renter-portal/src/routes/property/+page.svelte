<svelte:head>
	<title>Property Info - 21 Tatman</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Property Information</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-8">Important information about building systems, shutoffs, and emergency procedures.</p>

	<!-- Shutoff Locations -->
	<section class="mb-8">
		<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Shutoff Locations</h2>
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-blue-600 text-xl">💧</span>
					<h3 class="font-semibold text-gray-900 dark:text-gray-100">Water Main</h3>
				</div>
				<p class="text-sm text-gray-600 dark:text-gray-400">Located in the <strong>basement</strong>. Copper/galvanized entry piping.</p>
			</div>
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-orange-500 text-xl">🔥</span>
					<h3 class="font-semibold text-gray-900 dark:text-gray-100">Gas Main</h3>
				</div>
				<p class="text-sm text-gray-600 dark:text-gray-400">Located in the <strong>basement</strong>. Black iron fuel line.</p>
			</div>
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-yellow-500 text-xl">⚡</span>
					<h3 class="font-semibold text-gray-900 dark:text-gray-100">Electrical Panels</h3>
				</div>
				<p class="text-sm text-gray-600 dark:text-gray-400">4 panels in the <strong>basement</strong>. 100A each, breaker type.</p>
			</div>
		</div>
	</section>

	<!-- Building Systems -->
	<section class="mb-8">
		<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Building Systems</h2>
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
			<div class="p-5">
				<h3 class="font-semibold text-gray-900 dark:text-gray-100">Roof</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Asphalt shingle, gable style. 1-5 years old. Ridge ventilation. Lead flashing.</p>
			</div>
			<div class="p-5">
				<h3 class="font-semibold text-gray-900 dark:text-gray-100">Foundation</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Stone masonry (field stone). Brick exterior foundation. Basement has perimeter drainage and working sump pump.</p>
			</div>
			<div class="p-5">
				<h3 class="font-semibold text-gray-900 dark:text-gray-100">Heating & Cooling</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Mitsubishi heat pump (exterior, 1-5 years). Wall-mounted AC units per unit. Individual heating sources in each room.</p>
			</div>
			<div class="p-5">
				<h3 class="font-semibold text-gray-900 dark:text-gray-100">Plumbing</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Copper and PEX supply lines. Cast iron, PVC, and ABS drains. P-traps throughout.</p>
			</div>
			<div class="p-5">
				<h3 class="font-semibold text-gray-900 dark:text-gray-100">Water Heaters</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">4 water heaters (40 gallon each). Units 1-2: gas-fired. Unit 3: electric (Rheem). Water Heater 2 & 3: State brand, 1-5 years old.</p>
			</div>
			<div class="p-5">
				<h3 class="font-semibold text-gray-900 dark:text-gray-100">Electrical</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">4 main panels in basement. 100A each, breaker type. Underground service entry.</p>
			</div>
			<div class="p-5">
				<h3 class="font-semibold text-gray-900 dark:text-gray-100">Exterior</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Vinyl/metal siding, vinyl soffit, aluminum/steel fascia, vinyl windows. Galvanized/aluminum gutters.</p>
			</div>
		</div>
	</section>

	<!-- Basement Info -->
	<section class="mb-8">
		<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Basement</h2>
		<div class="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
			<p class="text-amber-800 dark:text-amber-300 text-sm">
				<strong>Note:</strong> The basement has a field stone foundation that may seep during heavy rain or snow melt.
				A sump pump and perimeter drainage system are installed and operational. Please keep any stored items off the floor.
			</p>
		</div>
	</section>

	<!-- Grounds -->
	<section>
		<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Grounds & Exterior</h2>
		<div class="grid sm:grid-cols-2 gap-4">
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Walkways</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">Concrete service walks. Vinyl fencing.</p>
			</div>
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Porches</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">Wood front porch (1st floor access). Wood side porch (2nd floor access).</p>
			</div>
		</div>
	</section>
</div>
