<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-700',
		paid: 'bg-blue-100 text-blue-700',
		processing: 'bg-purple-100 text-purple-700',
		shipped: 'bg-indigo-100 text-indigo-700',
		completed: 'bg-green-100 text-green-700',
		cancelled: 'bg-red-100 text-red-700'
	};
</script>

<svelte:head><title>Orders — Admin</title></svelte:head>

<div class="p-8">
	<h1 class="text-2xl font-bold text-gray-900 mb-8">Orders</h1>

	<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
		<table class="w-full text-sm">
			<thead class="bg-gray-50 border-b border-gray-200">
				<tr>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Order</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Customer</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Total</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Payment</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Status</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Date</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Update</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each data.orders as order}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4">
							<a href="/admin/orders/{order.id}" class="font-medium text-gray-900 hover:underline">{order.order_number}</a>
						</td>
						<td class="px-6 py-4">
							<p class="text-gray-900">{order.customer_name}</p>
							<p class="text-gray-500 text-xs">{order.customer_email}</p>
						</td>
						<td class="px-6 py-4 text-gray-700">RM {Number(order.total).toFixed(2)}</td>
						<td class="px-6 py-4">
							<span class="px-2 py-0.5 rounded-full text-xs {order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : order.payment_status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">
								{order.payment_status}
							</span>
						</td>
						<td class="px-6 py-4">
							<span class="px-2 py-0.5 rounded-full text-xs {statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}">
								{order.status}
							</span>
						</td>
						<td class="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString('en-MY')}</td>
						<td class="px-6 py-4">
							<form method="POST" action="?/updateStatus" use:enhance class="flex items-center gap-2">
								<input type="hidden" name="id" value={order.id} />
								<select name="status" class="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none">
									{#each ['pending','paid','processing','shipped','completed','cancelled'] as s}
										<option value={s} selected={s === order.status}>{s}</option>
									{/each}
								</select>
								<button type="submit" class="text-xs bg-gray-900 text-white px-2 py-1 rounded hover:bg-gray-700">Save</button>
							</form>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="7" class="px-6 py-8 text-center text-gray-400">No orders yet</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
