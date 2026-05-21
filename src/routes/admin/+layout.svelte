<script lang="ts">
	let { children } = $props();

	const nav = [
		{ href: '/admin', label: 'Dashboard' },
		{ href: '/admin/products', label: 'Products' },
		{ href: '/admin/orders', label: 'Orders' },
		{ href: '/admin/promos', label: 'Promos' }
	];
</script>

<div class="min-h-screen flex">
	<aside class="w-56 bg-gray-900 text-white flex-shrink-0 flex flex-col">
		<div class="p-6 border-b border-gray-700">
			<p class="font-bold text-lg">My Shop</p>
			<p class="text-gray-400 text-xs mt-0.5">Admin Panel</p>
		</div>
		<nav class="flex-1 p-4 space-y-1">
			{#each nav as item}
				<a href={item.href} class="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
					{item.label}
				</a>
			{/each}
		</nav>
		<div class="p-4 border-t border-gray-700">
			<form action="/logout" method="POST">
				<button type="submit" class="text-xs text-gray-400 hover:text-white">Sign out</button>
			</form>
		</div>
	</aside>

	<div class="flex-1 bg-gray-50 overflow-auto">
		{@render children()}
	</div>
</div>
