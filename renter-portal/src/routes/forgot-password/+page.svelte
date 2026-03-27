<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Forgot Password - 21 Tatman</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-4">
	<div class="w-full max-w-md">
		<div class="text-center mb-8">
			<div class="w-16 h-16 rounded-xl bg-[var(--color-accent)] flex items-center justify-center font-bold text-[var(--color-primary)] text-2xl mx-auto mb-4">
				21
			</div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Reset Password</h1>
			<p class="text-gray-500 dark:text-gray-400 mt-1">We'll send you a link to reset your password</p>
		</div>

		{#if form?.success}
			<div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
				<div class="text-4xl mb-4">&#9993;</div>
				<h2 class="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Check Your Email</h2>
				<p class="text-green-700 dark:text-green-400 mb-4">
					If an account exists for <strong>{form.email}</strong>, we've sent a password reset link. It will expire in 1 hour.
				</p>
				<a href="/login" class="text-sm text-[var(--color-primary)] dark:text-blue-400 hover:underline">
					Back to Sign In
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
						placeholder="your@email.com"
						class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
					/>
				</div>

				<button
					type="submit"
					disabled={submitting}
					class="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
				>
					{submitting ? 'Sending...' : 'Send Reset Link'}
				</button>
			</form>

			<p class="text-center text-sm text-gray-400 mt-6">
				<a href="/login" class="text-[var(--color-primary)] dark:text-blue-400 hover:underline">Back to Sign In</a>
			</p>
		{/if}
	</div>
</div>
