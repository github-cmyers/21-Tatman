<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<svelte:head>
	<title>Messages - Admin</title>
</svelte:head>

<div class="flex items-center justify-between mb-6">
	<h2 class="font-semibold text-gray-900">Messages ({data.messages.length})</h2>
	{#if data.messages.some((m: any) => !m.read)}
		<form method="POST" action="?/markAllRead" use:enhance>
			<button
				type="submit"
				class="text-sm text-[var(--color-primary)] hover:underline"
			>
				Mark all as read
			</button>
		</form>
	{/if}
</div>

{#if data.messages.length === 0}
	<div class="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center text-gray-500">
		No messages yet.
	</div>
{:else}
	<div class="space-y-4">
		{#each data.messages as msg}
			<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 {!msg.read ? 'border-l-4 border-l-[var(--color-accent)]' : ''}">
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-1">
							<span class="font-semibold text-gray-900">Unit {msg.unit}</span>
							<span class="text-gray-400">&middot;</span>
							<span class="text-gray-600">{msg.name}</span>
							{#if !msg.read}
								<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">New</span>
							{/if}
						</div>
						<p class="text-sm text-gray-700 mt-1">{msg.message}</p>
						<p class="text-xs text-gray-400 mt-2">{new Date(msg.created_at).toLocaleString()}</p>
					</div>

					{#if !msg.read}
						<form method="POST" action="?/markRead" use:enhance class="shrink-0">
							<input type="hidden" name="id" value={msg.id} />
							<button
								type="submit"
								class="text-xs text-[var(--color-primary)] hover:underline"
							>
								Mark read
							</button>
						</form>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
