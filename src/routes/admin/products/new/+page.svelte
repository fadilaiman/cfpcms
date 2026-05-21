<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let productType = $state('physical');
	let loading = $state(false);
</script>

<svelte:head><title>New Product — Admin</title></svelte:head>

<div class="p-8 max-w-2xl">
	<div class="flex items-center gap-4 mb-8">
		<a href="/admin/products" class="text-gray-500 hover:text-gray-900 text-sm">← Products</a>
		<h1 class="text-2xl font-bold text-gray-900">New Product</h1>
	</div>

	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">{form.error}</div>
	{/if}

	<form method="POST" use:enhance={() => { loading = true; return async ({ update }) => { loading = false; await update(); }; }}>
		<div class="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
				<input id="name" name="name" type="text" required
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
			</div>
			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
				<textarea id="description" name="description" rows="4"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"></textarea>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price (RM) *</label>
					<input id="price" name="price" type="number" required min="0" step="0.01" placeholder="0.00"
						class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
				</div>
				<div>
					<label for="type" class="block text-sm font-medium text-gray-700 mb-1">Type *</label>
					<select id="type" name="type" bind:value={productType}
						class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
						<option value="physical">Physical</option>
						<option value="digital">Digital</option>
					</select>
				</div>
			</div>
			{#if productType === 'physical'}
				<div>
					<label for="stock" class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
					<input id="stock" name="stock" type="number" min="0" placeholder="0"
						class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
				</div>
			{/if}
		</div>

		<div class="flex gap-3 mt-6">
			<button type="submit" disabled={loading}
				class="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
				{loading ? 'Creating...' : 'Create Product'}
			</button>
			<a href="/admin/products" class="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
				Cancel
			</a>
		</div>
	</form>
</div>
