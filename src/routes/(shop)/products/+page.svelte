<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Products — My Shop</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">All Products</h1>

	{#if data.products.length === 0}
		<p class="text-gray-500">No products available yet.</p>
	{:else}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{#each data.products as product}
				<a href="/products/{product.slug}" class="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors">
					<div class="aspect-square bg-gray-100 overflow-hidden">
						{#if product.images?.[0]}
							<img src={product.images[0]} alt={product.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
						{:else}
							<div class="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📦</div>
						{/if}
					</div>
					<div class="p-4">
						<p class="font-medium text-gray-900 truncate">{product.name}</p>
						<div class="flex items-center justify-between mt-1">
							<p class="text-gray-600 text-sm">RM {product.price.toFixed(2)}</p>
							{#if product.type === 'digital'}
								<span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Digital</span>
							{/if}
						</div>
						{#if product.stock === 0}
							<p class="text-red-500 text-xs mt-1">Out of stock</p>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
