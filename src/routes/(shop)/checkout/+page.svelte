<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
	let promoApplied = $state(false);
</script>

<svelte:head>
	<title>Checkout — My Shop</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-12">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

	{#if cart.items.length === 0}
		<div class="text-center py-16">
			<p class="text-gray-500 mb-6">Your cart is empty</p>
			<a href="/products" class="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium">Shop Now</a>
		</div>
	{:else}
		<div class="grid lg:grid-cols-5 gap-8">
			<!-- Form -->
			<div class="lg:col-span-3">
				<form
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							await update();
						};
					}}
				>
					<!-- Hidden cart data -->
					<input type="hidden" name="cart" value={JSON.stringify(cart.items)} />

					{#if form?.error}
						<div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
							{form.error}
						</div>
					{/if}

					<!-- Contact Info -->
					<div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
						<h2 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
						<div class="space-y-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1" for="name">Full Name *</label>
								<input id="name" name="name" type="text" required placeholder="Ahmad bin Ali"
									class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email *</label>
								<input id="email" name="email" type="email" required placeholder="ahmad@example.com"
									class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1" for="phone">Phone Number *</label>
								<input id="phone" name="phone" type="tel" required placeholder="0123456789"
									class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
							</div>
						</div>
					</div>

					<!-- Shipping Address (only if physical items) -->
					{#if cart.hasPhysical()}
						<div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
							<h2 class="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
							<div class="space-y-4">
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1" for="address_line1">Address Line 1 *</label>
									<input id="address_line1" name="address_line1" type="text" required
										placeholder="No 1, Jalan Example"
										class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1" for="address_line2">Address Line 2</label>
									<input id="address_line2" name="address_line2" type="text"
										placeholder="Taman Example"
										class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
								</div>
								<div class="grid grid-cols-3 gap-4">
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1" for="city">City *</label>
										<input id="city" name="city" type="text" required placeholder="Kuala Lumpur"
											class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1" for="state">State *</label>
										<select id="state" name="state" required
											class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
											<option value="">Select</option>
											{#each ['Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Perak','Perlis','Pulau Pinang','Sabah','Sarawak','Selangor','Terengganu','W.P. Kuala Lumpur','W.P. Labuan','W.P. Putrajaya'] as s}
												<option value={s}>{s}</option>
											{/each}
										</select>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1" for="postcode">Postcode *</label>
										<input id="postcode" name="postcode" type="text" required placeholder="50000"
											maxlength="5" pattern="[0-9]{5}"
											class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Promo Code -->
					<div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
						<h2 class="text-lg font-semibold text-gray-900 mb-4">Promo Code</h2>
						<div class="flex gap-2">
							<input name="promo_code" type="text" placeholder="Enter promo code"
								class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:border-black" />
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Processing...' : 'Pay Now via ToyyibPay'}
					</button>
				</form>
			</div>

			<!-- Order Summary -->
			<div class="lg:col-span-2">
				<div class="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
					<div class="space-y-3 mb-6">
						{#each cart.items as item}
							<div class="flex justify-between text-sm">
								<span class="text-gray-700 flex-1 mr-2 truncate">{item.name} × {item.quantity}</span>
								<span class="text-gray-900 font-medium whitespace-nowrap">RM {(item.price * item.quantity).toFixed(2)}</span>
							</div>
						{/each}
					</div>
					<div class="border-t border-gray-200 pt-4">
						<div class="flex justify-between font-semibold text-gray-900">
							<span>Total</span>
							<span>RM {cart.subtotal.toFixed(2)}</span>
						</div>
						<p class="text-xs text-gray-500 mt-2">Final amount may vary after promo code applied</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
