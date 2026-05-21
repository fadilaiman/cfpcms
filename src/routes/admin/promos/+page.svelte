<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Promos — Admin</title></svelte:head>

<div class="p-8">
	<h1 class="text-2xl font-bold text-gray-900 mb-8">Promo Codes</h1>

	<!-- Create Form -->
	<div class="bg-white rounded-xl border border-gray-200 p-6 mb-8">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Create Promo Code</h2>

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{form.error}</div>
		{/if}

		<form method="POST" action="?/create" use:enhance class="grid grid-cols-3 gap-4">
			<div>
				<label for="code" class="block text-sm font-medium text-gray-700 mb-1">Code *</label>
				<input id="code" name="code" type="text" required placeholder="SAVE10"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:border-black" />
			</div>
			<div>
				<label for="type" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
				<select id="type" name="type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
					<option value="percentage">Percentage (%)</option>
					<option value="fixed">Fixed (RM)</option>
				</select>
			</div>
			<div>
				<label for="value" class="block text-sm font-medium text-gray-700 mb-1">Value *</label>
				<input id="value" name="value" type="number" required min="0" step="0.01" placeholder="10"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
			</div>
			<div>
				<label for="min_order" class="block text-sm font-medium text-gray-700 mb-1">Min Order (RM)</label>
				<input id="min_order" name="min_order" type="number" min="0" step="0.01" placeholder="0"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
			</div>
			<div>
				<label for="max_uses" class="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
				<input id="max_uses" name="max_uses" type="number" min="1" placeholder="Unlimited"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
			</div>
			<div>
				<label for="expires_at" class="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
				<input id="expires_at" name="expires_at" type="datetime-local"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
			</div>
			<div class="col-span-3">
				<button type="submit" class="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
					Create Promo
				</button>
			</div>
		</form>
	</div>

	<!-- Promos List -->
	<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
		<table class="w-full text-sm">
			<thead class="bg-gray-50 border-b border-gray-200">
				<tr>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Code</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Discount</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Usage</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Expires</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Status</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each data.promos as promo}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4 font-mono font-medium text-gray-900">{promo.code}</td>
						<td class="px-6 py-4 text-gray-700">
							{promo.type === 'percentage' ? `${promo.value}%` : `RM ${Number(promo.value).toFixed(2)}`}
							{#if promo.min_order > 0}
								<span class="text-gray-400 text-xs ml-1">(min RM {Number(promo.min_order).toFixed(2)})</span>
							{/if}
						</td>
						<td class="px-6 py-4 text-gray-700">
							{promo.used_count} / {promo.max_uses ?? '∞'}
						</td>
						<td class="px-6 py-4 text-gray-500">
							{promo.expires_at ? new Date(promo.expires_at).toLocaleDateString('en-MY') : 'Never'}
						</td>
						<td class="px-6 py-4">
							<span class="px-2 py-0.5 rounded-full text-xs {promo.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">
								{promo.is_active ? 'Active' : 'Disabled'}
							</span>
						</td>
						<td class="px-6 py-4 flex items-center gap-3">
							<form method="POST" action="?/toggle" use:enhance>
								<input type="hidden" name="id" value={promo.id} />
								<input type="hidden" name="is_active" value={String(promo.is_active)} />
								<button type="submit" class="text-gray-500 hover:text-gray-900 text-sm">
									{promo.is_active ? 'Disable' : 'Enable'}
								</button>
							</form>
							<form method="POST" action="?/delete" use:enhance onsubmit={(e) => { if (!confirm('Delete this promo?')) e.preventDefault(); }}>
								<input type="hidden" name="id" value={promo.id} />
								<button type="submit" class="text-red-500 hover:text-red-700 text-sm">Delete</button>
							</form>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-6 py-8 text-center text-gray-400">No promos yet</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
