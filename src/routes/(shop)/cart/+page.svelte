<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
</script>

<svelte:head>
	<title>Cart — My Shop</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-12">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

	{#if cart.items.length === 0}
		<div class="text-center py-16">
			<p class="text-gray-500 text-lg mb-6">Your cart is empty</p>
			<a href="/products" class="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
				Continue Shopping
			</a>
		</div>
	{:else}
		<div class="space-y-4 mb-8">
			{#each cart.items as item}
				<div class="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
					<div class="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
						{#if item.image}
							<img src={item.image} alt={item.name} class="w-full h-full object-cover" />
						{:else}
							<div class="w-full h-full flex items-center justify-center text-gray-300 text-2xl">📦</div>
						{/if}
					</div>

					<div class="flex-1 min-w-0">
						<a href="/products/{item.slug}" class="font-medium text-gray-900 hover:underline truncate block">{item.name}</a>
						<p class="text-sm text-gray-500 mt-0.5">RM {item.price.toFixed(2)} each</p>
						{#if item.type === 'digital'}
							<span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Digital</span>
						{/if}
					</div>

					<div class="flex items-center gap-2">
						<button
							onclick={() => cart.updateQty(item.productId, item.quantity - 1)}
							class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg"
						>−</button>
						<span class="w-8 text-center font-medium">{item.quantity}</span>
						<button
							onclick={() => cart.updateQty(item.productId, item.quantity + 1)}
							class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg"
						>+</button>
					</div>

					<div class="text-right ml-4">
						<p class="font-medium text-gray-900">RM {(item.price * item.quantity).toFixed(2)}</p>
						<button
							onclick={() => cart.remove(item.productId)}
							class="text-xs text-red-500 hover:text-red-700 mt-1"
						>Remove</button>
					</div>
				</div>
			{/each}
		</div>

		<div class="bg-white rounded-xl border border-gray-200 p-6">
			<div class="flex justify-between text-lg font-semibold text-gray-900 mb-6">
				<span>Subtotal</span>
				<span>RM {cart.subtotal.toFixed(2)}</span>
			</div>
			<a href="/checkout" class="block w-full bg-black text-white text-center py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
				Proceed to Checkout
			</a>
			<a href="/products" class="block text-center text-sm text-gray-500 hover:text-gray-900 mt-3">
				Continue Shopping
			</a>
		</div>
	{/if}
</div>
