<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { cart } from '$lib/stores/cart.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let { children } = $props();
	let isAdmin = $derived($page.url.pathname.startsWith('/admin'));
	let isLogin = $derived($page.url.pathname === '/login');

	onMount(() => {
		cart.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !isAdmin && !isLogin}
	<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
		<div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
			<a href="/" class="text-xl font-bold text-gray-900">My Shop</a>
			<nav class="flex items-center gap-6 text-sm font-medium text-gray-600">
				<a href="/products" class="hover:text-gray-900">Products</a>
				<a href="/cart" class="relative hover:text-gray-900">
					Cart
					{#if cart.count > 0}
						<span class="absolute -top-2 -right-4 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
							{cart.count}
						</span>
					{/if}
				</a>
			</nav>
		</div>
	</header>

	<main class="min-h-screen bg-gray-50">
		{@render children()}
	</main>

	<footer class="bg-white border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500">
		&copy; {new Date().getFullYear()} My Shop
	</footer>
{:else}
	{@render children()}
{/if}
