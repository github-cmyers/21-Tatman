<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Sign In - 21 Tatman</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-4">
	<div class="w-full max-w-md">
		<div class="text-center mb-8">
			<div class="w-16 h-16 rounded-xl bg-[var(--color-accent)] flex items-center justify-center font-bold text-[var(--color-primary)] text-2xl mx-auto mb-4">
				21
			</div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">21 Tatman Street</h1>
			<p class="text-gray-500 dark:text-gray-400 mt-1">Renter Portal</p>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
			class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5"
		>
			<h2 class="font-semibold text-gray-900 dark:text-gray-100 text-lg">Sign In</h2>

			{#if form?.error}
				<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
					<p class="text-red-700 dark:text-red-400 text-sm">{form.error}</p>
				</div>
			{/if}

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					value={form?.email ?? ''}
					autocomplete="email"
					class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					autocomplete="current-password"
					class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
				/>
			</div>

			<button
				type="submit"
				disabled={submitting}
				class="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
			>
				{submitting ? 'Signing in...' : 'Sign In'}
			</button>
		</form>

		<p class="text-center text-sm text-gray-400 mt-6">
			Contact your property manager if you need login credentials.
		</p>
	</div>
</div>
