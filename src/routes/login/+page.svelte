<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin Login</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	<div class="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-md">
		<h1 class="text-2xl font-bold text-gray-900 mb-6">Admin Login</h1>

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
				{form.error}
			</div>
		{/if}

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
			<div class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input id="email" name="email" type="email" required autocomplete="email"
						class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
				</div>
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
					<input id="password" name="password" type="password" required autocomplete="current-password"
						class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
				</div>
				<button
					type="submit"
					disabled={loading}
					class="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
				>
					{loading ? 'Signing in...' : 'Sign In'}
				</button>
			</div>
		</form>
	</div>
</div>
