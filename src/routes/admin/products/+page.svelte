<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Products — Admin</title></svelte:head>

<div class="p-8">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Products</h1>
		<a href="/admin/products/new" class="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
			+ Add Product
		</a>
	</div>

	<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
		<table class="w-full text-sm">
			<thead class="bg-gray-50 border-b border-gray-200">
				<tr>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Name</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Type</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Price</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Stock</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Status</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each data.products as product}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4 font-medium text-gray-900">{product.name}</td>
						<td class="px-6 py-4">
							<span class="px-2 py-0.5 rounded-full text-xs {product.type === 'digital' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}">
								{product.type}
							</span>
						</td>
						<td class="px-6 py-4 text-gray-700">RM {Number(product.price).toFixed(2)}</td>
						<td class="px-6 py-4 text-gray-700">{product.stock ?? '∞'}</td>
						<td class="px-6 py-4">
							<span class="px-2 py-0.5 rounded-full text-xs {product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
								{product.is_active ? 'Active' : 'Hidden'}
							</span>
						</td>
						<td class="px-6 py-4 flex items-center gap-3">
							<a href="/admin/products/{product.id}/edit" class="text-gray-500 hover:text-gray-900">Edit</a>
							<form method="POST" action="?/toggleActive" use:enhance>
								<input type="hidden" name="id" value={product.id} />
								<input type="hidden" name="is_active" value={String(product.is_active)} />
								<button type="submit" class="text-gray-500 hover:text-gray-900">
									{product.is_active ? 'Hide' : 'Show'}
								</button>
							</form>
							<form method="POST" action="?/delete" use:enhance onsubmit={(e) => { if (!confirm('Delete this product?')) e.preventDefault(); }}>
								<input type="hidden" name="id" value={product.id} />
								<button type="submit" class="text-red-500 hover:text-red-700">Delete</button>
							</form>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-6 py-8 text-center text-gray-400">No products yet</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
