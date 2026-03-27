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
	<h1 class="text-2xl font-bold text-gray-900 mb-2">Contact</h1>
	<p class="text-gray-600 mb-8">Get in touch with your property manager for questions, concerns, or general inquiries.</p>

	<div class="grid md:grid-cols-2 gap-8">
		<!-- Contact Info -->
		<div class="space-y-6">
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h2 class="font-semibold text-gray-900 mb-4">Property Management</h2>
				<div class="space-y-4">
					<div>
						<h3 class="text-xs font-medium text-gray-500 uppercase">Property Address</h3>
						<p class="text-gray-900 mt-1">21 Tatman Street<br>Worcester, MA</p>
					</div>
					<div>
						<h3 class="text-xs font-medium text-gray-500 uppercase">Email</h3>
						<p class="text-gray-900 mt-1">mail.cmyers@gmail.com</p>
					</div>
					<div>
						<h3 class="text-xs font-medium text-gray-500 uppercase">Response Time</h3>
						<p class="text-gray-900 mt-1">24-48 hours for non-urgent inquiries</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h2 class="font-semibold text-gray-900 mb-4">Important Reminders</h2>
				<ul class="space-y-3 text-sm text-gray-600">
					<li class="flex items-start gap-2">
						<span class="text-red-500 mt-0.5 shrink-0">!</span>
						<span>For emergencies (fire, flood, gas), call <strong>911</strong> first.</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-amber-500 mt-0.5 shrink-0">!</span>
						<span>For maintenance issues, please use the <a href="/maintenance" class="text-[var(--color-primary)] underline">Maintenance Request</a> form.</span>
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
				<div class="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
					<div class="text-4xl mb-4">&#10003;</div>
					<h2 class="text-xl font-semibold text-green-800 mb-2">Message Sent</h2>
					<p class="text-green-700 mb-6">We'll get back to you within 24-48 hours.</p>
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
					class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5"
				>
					<h2 class="font-semibold text-gray-900">Send a Message</h2>
					<p class="text-sm text-gray-500">Sending as <span class="font-medium text-gray-700">{tenant?.name}</span> (Unit {tenant?.unit})</p>

					{#if form?.error}
						<div class="bg-red-50 border border-red-200 rounded-lg p-3">
							<p class="text-red-700 text-sm">{form.error}</p>
						</div>
					{/if}

					<div>
						<label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
						<textarea
							id="message"
							name="message"
							required
							rows="5"
							placeholder="How can we help you?"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-y"
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
