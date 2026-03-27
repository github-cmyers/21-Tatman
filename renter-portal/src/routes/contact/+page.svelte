<script lang="ts">
	import { enhance } from '$app/forms';

	let { form, data } = $props();

	let submitted = $state(false);
	let submitting = $state(false);

	const tenant = $derived(data.tenant);

	function resetForm() {
		submitted = false;
	}
</script>

<svelte:head>
	<title>Contact - 21 Tatman</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Contact</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-8">Get in touch with your property manager for questions, concerns, or general inquiries.</p>

	<div class="grid md:grid-cols-2 gap-8">
		<!-- Contact Info -->
		<div class="space-y-6">
			<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
				<h2 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">Property Management</h2>
				<div class="space-y-4">
					<div>
						<h3 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Property Address</h3>
						<p class="text-gray-900 dark:text-gray-100 mt-1">21 Tatman Street<br>Worcester, MA</p>
					</div>
					<div>
						<h3 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</h3>
						<p class="text-gray-900 dark:text-gray-100 mt-1">mail.cmyers@gmail.com</p>
					</div>
					<div>
						<h3 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Response Time</h3>
						<p class="text-gray-900 dark:text-gray-100 mt-1">24-48 hours for non-urgent inquiries</p>
					</div>
				</div>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
				<h2 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">Important Reminders</h2>
				<ul class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
					<li class="flex items-start gap-2">
						<span class="text-red-500 mt-0.5 shrink-0">!</span>
						<span>For emergencies (fire, flood, gas), call <strong class="text-gray-900 dark:text-gray-100">911</strong> first.</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-amber-500 mt-0.5 shrink-0">!</span>
						<span>For maintenance issues, please use the <a href="/maintenance" class="text-[var(--color-primary)] dark:text-blue-400 underline">Maintenance Request</a> form.</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-blue-500 mt-0.5 shrink-0">i</span>
						<span>Rent payments should be submitted through your agreed-upon payment method.</span>
					</li>
				</ul>
			</div>
		</div>

		<!-- Contact Form -->
		<div>
			{#if submitted}
				<div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
					<div class="text-4xl mb-4">&#10003;</div>
					<h2 class="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Message Sent</h2>
					<p class="text-green-700 dark:text-green-400 mb-6">We'll get back to you within 24-48 hours.</p>
					<button
						onclick={resetForm}
						class="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
					>
						Send Another Message
					</button>
				</div>
			{:else}
				<form
					method="POST"
					use:enhance={() => {
						submitting = true;
						return async ({ result, update }) => {
							submitting = false;
							if (result.type === 'success') {
								submitted = true;
							} else {
								await update();
							}
						};
					}}
					class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5"
				>
					<h2 class="font-semibold text-gray-900 dark:text-gray-100">Send a Message</h2>
					<p class="text-sm text-gray-500 dark:text-gray-400">Sending as <span class="font-medium text-gray-700 dark:text-gray-300">{tenant?.name}</span> (Unit {tenant?.unit})</p>

					{#if form?.error}
						<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
							<p class="text-red-700 dark:text-red-400 text-sm">{form.error}</p>
						</div>
					{/if}

					<div>
						<label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
						<textarea
							id="message"
							name="message"
							required
							rows="5"
							placeholder="How can we help you?"
							class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-y placeholder:text-gray-400 dark:placeholder:text-gray-500"
						></textarea>
					</div>

					<button
						type="submit"
						disabled={submitting}
						class="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
					>
						{submitting ? 'Sending...' : 'Send Message'}
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>
