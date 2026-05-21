<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let addedToCart = $state(false);
	let selectedImage = $state(0);

	const outOfStock = $derived(data.product.type === 'physical' && data.product.stock === 0);

	function handleAddToCart() {
		if (outOfStock) return;
		const p = data.product;
		cart.add({
			productId: p.id,
			name: p.name,
			slug: p.slug,
			price: p.price,
			type: p.type,
			image: p.images?.[0] ?? null
		});
		addedToCart = true;
		setTimeout(() => (addedToCart = false), 2000);
	}
</script>

<svelte:head>
	<title>{data.product.name} — My Shop</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
	<nav class="text-sm text-gray-500 mb-8">
		<a href="/products" class="hover:text-gray-900">Products</a>
		<span class="mx-2">/</span>
		<span class="text-gray-900">{data.product.name}</span>
	</nav>

	<div class="grid md:grid-cols-2 gap-12">
		<!-- Images -->
		<div>
			<div class="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
				{#if data.product.images?.[selectedImage]}
					<img src={data.product.images[selectedImage]} alt={data.product.name} class="w-full h-full object-cover" />
				{:else}
					<div class="w-full h-full flex items-center justify-center text-gray-300 text-6xl">📦</div>
				{/if}
			</div>
			{#if data.product.images?.length > 1}
				<div class="flex gap-2 overflow-x-auto">
					{#each data.product.images as img, i}
						<button
							onclick={() => (selectedImage = i)}
							class="w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors {selectedImage === i ? 'border-black' : 'border-transparent'}"
						>
							<img src={img} alt={data.product.name} class="w-full h-full object-cover" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Details -->
		<div>
			<div class="flex items-start justify-between gap-4">
				<h1 class="text-3xl font-bold text-gray-900">{data.product.name}</h1>
				{#if data.product.type === 'digital'}
					<span class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full whitespace-nowrap">Digital</span>
				{/if}
			</div>

			<p class="text-3xl font-semibold text-gray-900 mt-4">RM {data.product.price.toFixed(2)}</p>

			{#if data.product.description}
				<div class="mt-6 text-gray-600 leading-relaxed">
					{@html data.product.description}
				</div>
			{/if}

			{#if data.product.type === 'physical' && data.product.stock !== null}
				<p class="mt-4 text-sm {data.product.stock > 0 ? 'text-green-600' : 'text-red-500'}">
					{data.product.stock > 0 ? `${data.product.stock} in stock` : 'Out of stock'}
				</p>
			{/if}

			<button
				onclick={handleAddToCart}
				disabled={outOfStock}
				class="mt-8 w-full py-3 px-8 rounded-lg font-medium transition-colors
					{outOfStock
						? 'bg-gray-200 text-gray-400 cursor-not-allowed'
						: addedToCart
							? 'bg-green-600 text-white'
							: 'bg-black text-white hover:bg-gray-800'}"
			>
				{outOfStock ? 'Out of Stock' : addedToCart ? 'Added!' : 'Add to Cart'}
			</button>

			{#if !outOfStock}
				<a href="/cart" class="block text-center text-sm text-gray-500 hover:text-gray-900 mt-3">
					View Cart ({cart.count} items)
				</a>
			{/if}
		</div>
	</div>
</div>
