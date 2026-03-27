<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Reset Password - 21 Tatman</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-4">
	<div class="w-full max-w-md">
		<div class="text-center mb-8">
			<div class="w-16 h-16 rounded-xl bg-[var(--color-accent)] flex items-center justify-center font-bold text-[var(--color-primary)] text-2xl mx-auto mb-4">
				21
			</div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Set New Password</h1>
		</div>

		{#if form?.success}
			<div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
				<div class="text-4xl mb-4">&#10003;</div>
				<h2 class="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Password Updated</h2>
				<p class="text-green-700 dark:text-green-400 mb-6">
					Your password has been reset successfully. You can now sign in with your new password.
				</p>
				<a
					href="/login"
					class="inline-block bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[var(--color-primary-light)] transition-colors"
				>
					Sign In
				</a>
			</div>
		{:else if !data.valid}
			<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
				<div class="text-4xl mb-4">&#10007;</div>
				<h2 class="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Invalid or Expired Link</h2>
				<p class="text-red-700 dark:text-red-400 mb-6">
					This password reset link is invalid or has expired. Please request a new one.
				</p>
				<a
					href="/forgot-password"
					class="inline-block bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[var(--color-primary-light)] transition-colors"
				>
					Request New Link
				</a>
			</div>
		{:else}
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
				<input type="hidden" name="token" value={data.token} />

				<p class="text-sm text-gray-600 dark:text-gray-400">
					Resetting password for <strong class="text-gray-900 dark:text-gray-100">{data.email}</strong>
				</p>

				{#if form?.error}
					<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
						<p class="text-red-700 dark:text-red-400 text-sm">{form.error}</p>
					</div>
				{/if}

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						minlength="6"
						autocomplete="new-password"
						class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
					/>
				</div>

				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						minlength="6"
						autocomplete="new-password"
						class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
					/>
				</div>

				<button
					type="submit"
					disabled={submitting}
					class="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
				>
					{submitting ? 'Updating...' : 'Update Password'}
				</button>
			</form>
		{/if}
	</div>
</div>
