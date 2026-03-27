<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let showForm = $state(false);
</script>

<svelte:head>
	<title>Tenants - Admin</title>
</svelte:head>

<div class="flex items-center justify-between mb-6">
	<h2 class="font-semibold text-gray-900 dark:text-gray-100">Tenants ({data.tenants.length})</h2>
	<button
		onclick={() => (showForm = !showForm)}
		class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors"
	>
		{showForm ? 'Cancel' : 'Add Tenant'}
	</button>
</div>

{#if form?.error}
	<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
		<p class="text-red-700 dark:text-red-400 text-sm">{form.error}</p>
	</div>
{/if}

{#if form?.success}
	<div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
		<p class="text-green-700 dark:text-green-400 text-sm">Tenant created successfully.</p>
	</div>
{/if}

{#if showForm}
	<form
		method="POST"
		action="?/create"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					showForm = false;
				}
				await update();
			};
		}}
		class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 space-y-4"
	>
		<h3 class="font-semibold text-gray-900 dark:text-gray-100">New Tenant</h3>
		<div class="grid sm:grid-cols-2 gap-4">
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
				<input id="name" name="name" type="text" required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />
			</div>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
				<input id="email" name="email" type="email" required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />
			</div>
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
				<input id="password" name="password" type="text" required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />
			</div>
			<div>
				<label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (optional)</label>
				<input id="phone" name="phone" type="tel" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]" />
			</div>
			<div>
				<label for="unit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
				<select id="unit" name="unit" required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]">
					<option value="">Select unit</option>
					<option value="1">Unit 1 (1st Floor)</option>
					<option value="2">Unit 2 (2nd Floor)</option>
					<option value="3">Unit 3 (3rd Floor)</option>
				</select>
			</div>
		</div>
		<button type="submit" class="bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors">
			Create Tenant
		</button>
	</form>
{/if}

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead class="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs uppercase">
				<tr>
					<th class="px-5 py-3 text-left">Name</th>
					<th class="px-5 py-3 text-left">Email</th>
					<th class="px-5 py-3 text-left">Phone</th>
					<th class="px-5 py-3 text-left">Unit</th>
					<th class="px-5 py-3 text-left">Role</th>
					<th class="px-5 py-3 text-left">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-700">
				{#each data.tenants as tenant}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30">
						<td class="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">{tenant.name}</td>
						<td class="px-5 py-3 text-gray-600 dark:text-gray-400">{tenant.email}</td>
						<td class="px-5 py-3 text-gray-600 dark:text-gray-400">{tenant.phone || '-'}</td>
						<td class="px-5 py-3 text-gray-700 dark:text-gray-300">Unit {tenant.unit}</td>
						<td class="px-5 py-3">
							{#if tenant.is_admin}
								<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">Admin</span>
							{:else}
								<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Tenant</span>
							{/if}
						</td>
						<td class="px-5 py-3">
							{#if !tenant.is_admin}
								<form method="POST" action="?/delete" use:enhance class="inline">
									<input type="hidden" name="id" value={tenant.id} />
									<button
										type="submit"
										onclick={(e) => { if (!confirm('Remove this tenant?')) e.preventDefault(); }}
										class="text-red-600 dark:text-red-400 hover:underline text-xs"
									>
										Remove
									</button>
								</form>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
