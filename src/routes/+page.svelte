<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>My Shop</title>
</svelte:head>

<section class="max-w-6xl mx-auto px-4 py-16 text-center">
	<h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to My Shop</h1>
	<p class="text-lg text-gray-600 mb-8">Discover our collection of products</p>
	<a href="/products" class="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
		Shop Now
	</a>
</section>

{#if data.featured?.length > 0}
	<section class="max-w-6xl mx-auto px-4 pb-16">
		<h2 class="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
			{#each data.featured as product}
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
						<p class="text-gray-600 text-sm mt-1">RM {product.price.toFixed(2)}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}
