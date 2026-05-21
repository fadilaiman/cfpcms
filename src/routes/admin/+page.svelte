<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Dashboard — Admin</title></svelte:head>

<div class="p-8">
	<h1 class="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

	<div class="grid grid-cols-3 gap-6 mb-8">
		<div class="bg-white rounded-xl border border-gray-200 p-6">
			<p class="text-sm text-gray-500">Total Orders</p>
			<p class="text-3xl font-bold text-gray-900 mt-1">{data.totalOrders}</p>
		</div>
		<div class="bg-white rounded-xl border border-gray-200 p-6">
			<p class="text-sm text-gray-500">Total Revenue</p>
			<p class="text-3xl font-bold text-gray-900 mt-1">RM {data.totalRevenue.toFixed(2)}</p>
		</div>
		<div class="bg-white rounded-xl border border-gray-200 p-6">
			<p class="text-sm text-gray-500">Pending Fulfillment</p>
			<p class="text-3xl font-bold text-gray-900 mt-1">{data.pendingOrders}</p>
		</div>
	</div>

	<div class="flex gap-4">
		<a href="/admin/orders" class="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">View Orders</a>
		<a href="/admin/products/new" class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Add Product</a>
	</div>
</div>
