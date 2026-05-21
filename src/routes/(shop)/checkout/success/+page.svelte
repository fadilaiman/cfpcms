<script lang="ts">
	import { page } from '$app/stores';
	import { cart } from '$lib/stores/cart.svelte';
	import { onMount } from 'svelte';

	const billcode = $derived($page.url.searchParams.get('billcode'));
	const status = $derived($page.url.searchParams.get('status_id'));

	onMount(() => {
		// Clear cart after successful redirect from ToyyibPay
		if (status === '1') {
			cart.clear();
		}
	});
</script>

<svelte:head>
	<title>Order Confirmation — My Shop</title>
</svelte:head>

<div class="max-w-lg mx-auto px-4 py-24 text-center">
	{#if status === '1'}
		<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
			<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
		</div>
		<h1 class="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
		<p class="text-gray-600 mb-2">Thank you for your order. We've received your payment.</p>
		<p class="text-gray-500 text-sm mb-8">Check your email for order confirmation and delivery details.</p>
		{#if billcode}
			<p class="text-xs text-gray-400 mb-8">Reference: {billcode}</p>
		{/if}
	{:else if status === '2'}
		<div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
			<svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
		<h1 class="text-3xl font-bold text-gray-900 mb-4">Payment Pending</h1>
		<p class="text-gray-600 mb-8">Your payment is being processed. We'll email you once confirmed.</p>
	{:else}
		<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
			<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</div>
		<h1 class="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
		<p class="text-gray-600 mb-8">Your payment was not completed. Your cart items are still saved.</p>
	{/if}

	<a href="/products" class="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
		Continue Shopping
	</a>
</div>
