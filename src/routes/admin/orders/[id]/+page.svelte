<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const order = $derived(data.order);

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-700',
		paid: 'bg-blue-100 text-blue-700',
		processing: 'bg-purple-100 text-purple-700',
		shipped: 'bg-indigo-100 text-indigo-700',
		completed: 'bg-green-100 text-green-700',
		cancelled: 'bg-red-100 text-red-700'
	};
</script>

<svelte:head><title>{order.order_number} — Admin</title></svelte:head>

<div class="p-8 max-w-4xl">
	<div class="flex items-center gap-4 mb-8">
		<a href="/admin/orders" class="text-gray-500 hover:text-gray-900 text-sm">← Orders</a>
		<h1 class="text-2xl font-bold text-gray-900">{order.order_number}</h1>
		<span class="px-2.5 py-0.5 rounded-full text-xs font-medium {statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}">
			{order.status}
		</span>
		<span class="px-2.5 py-0.5 rounded-full text-xs font-medium {order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : order.payment_status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">
			Payment: {order.payment_status}
		</span>
	</div>

	<div class="grid grid-cols-2 gap-6 mb-6">
		<!-- Customer Info -->
		<div class="bg-white rounded-xl border border-gray-200 p-6">
			<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Customer</h2>
			<p class="font-medium text-gray-900">{order.customer_name}</p>
			<p class="text-gray-600 text-sm">{order.customer_email}</p>
			<p class="text-gray-600 text-sm">{order.customer_phone}</p>
		</div>

		<!-- Order Meta -->
		<div class="bg-white rounded-xl border border-gray-200 p-6">
			<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Order Info</h2>
			<dl class="space-y-1 text-sm">
				<div class="flex justify-between">
					<dt class="text-gray-500">Date</dt>
					<dd class="text-gray-900">{new Date(order.created_at).toLocaleString('en-MY')}</dd>
				</div>
				{#if order.bill_code}
					<div class="flex justify-between">
						<dt class="text-gray-500">Bill Code</dt>
						<dd class="font-mono text-gray-900">{order.bill_code}</dd>
					</div>
				{/if}
				{#if order.ref_no}
					<div class="flex justify-between">
						<dt class="text-gray-500">Ref No</dt>
						<dd class="font-mono text-gray-900">{order.ref_no}</dd>
					</div>
				{/if}
				{#if order.promo_code}
					<div class="flex justify-between">
						<dt class="text-gray-500">Promo</dt>
						<dd class="font-mono text-gray-900">{order.promo_code}</dd>
					</div>
				{/if}
			</dl>
		</div>
	</div>

	{#if order.shipping_address}
		<div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
			<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Shipping Address</h2>
			<p class="text-sm text-gray-700">{order.shipping_address.line1}</p>
			{#if order.shipping_address.line2}
				<p class="text-sm text-gray-700">{order.shipping_address.line2}</p>
			{/if}
			<p class="text-sm text-gray-700">{order.shipping_address.postcode} {order.shipping_address.city}</p>
			<p class="text-sm text-gray-700">{order.shipping_address.state}</p>
		</div>
	{/if}

	<!-- Order Items -->
	<div class="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
		<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide px-6 py-4 border-b border-gray-100">Items</h2>
		<table class="w-full text-sm">
			<thead class="bg-gray-50">
				<tr>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Product</th>
					<th class="text-left px-6 py-3 font-medium text-gray-600">Type</th>
					<th class="text-right px-6 py-3 font-medium text-gray-600">Qty</th>
					<th class="text-right px-6 py-3 font-medium text-gray-600">Unit Price</th>
					<th class="text-right px-6 py-3 font-medium text-gray-600">Total</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each order.order_items as item}
					<tr>
						<td class="px-6 py-3 font-medium text-gray-900">{item.product_name}</td>
						<td class="px-6 py-3">
							<span class="px-2 py-0.5 rounded-full text-xs {item.product_type === 'digital' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}">
								{item.product_type}
							</span>
						</td>
						<td class="px-6 py-3 text-right text-gray-700">{item.quantity}</td>
						<td class="px-6 py-3 text-right text-gray-700">RM {Number(item.unit_price).toFixed(2)}</td>
						<td class="px-6 py-3 text-right font-medium text-gray-900">RM {Number(item.total_price).toFixed(2)}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot class="border-t border-gray-200 bg-gray-50">
				<tr>
					<td colspan="4" class="px-6 py-3 text-right text-sm text-gray-500">Subtotal</td>
					<td class="px-6 py-3 text-right text-sm text-gray-700">RM {Number(order.subtotal).toFixed(2)}</td>
				</tr>
				{#if order.discount > 0}
					<tr>
						<td colspan="4" class="px-6 py-1 text-right text-sm text-gray-500">Discount</td>
						<td class="px-6 py-1 text-right text-sm text-green-600">− RM {Number(order.discount).toFixed(2)}</td>
					</tr>
				{/if}
				<tr>
					<td colspan="4" class="px-6 py-3 text-right font-semibold text-gray-900">Total</td>
					<td class="px-6 py-3 text-right font-semibold text-gray-900">RM {Number(order.total).toFixed(2)}</td>
				</tr>
			</tfoot>
		</table>
	</div>

	<!-- Update Status -->
	<div class="bg-white rounded-xl border border-gray-200 p-6">
		<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Update Status</h2>
		<form method="POST" action="?/updateStatus" use:enhance class="flex items-center gap-3">
			<select name="status" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
				{#each ['pending','paid','processing','shipped','completed','cancelled'] as s}
					<option value={s} selected={s === order.status}>{s}</option>
				{/each}
			</select>
			<button type="submit" class="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
				Save
			</button>
		</form>
	</div>
</div>
