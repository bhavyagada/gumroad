<script>
  import { onMount } from 'svelte';
  import { user_store } from '$lib';

  let fullName = '';
  let email = '';
  let paypalAddress = '';

  onMount(() => {
    user_store.subscribe(user => {
      if (user) {
        fullName = user.fullName || '';
        email = user.email || '';
        paypalAddress = user.paypalAddress || '';
      }
    });
  });

  function updateAccount() {
    // TODO: Implement account update logic
    console.log('Updating account:', { fullName, email, paypalAddress });
  }
</script>

<svelte:head>
  <title>Gumroad - Account</title>
</svelte:head>

<div class="bg-white p-8 rounded-t-lg border border-gray-300 shadow-md">
  <h3 class="text-2xl font-bold text-gray-800 mb-4">Your account settings</h3>
  <form on:submit|preventDefault={updateAccount} class="space-y-6">
    <div class="flex items-center">
      <label for="fullName" class="w-1/4 text-lg">Full name:</label>
      <input type="text" id="fullName" bind:value={fullName} required class="w-3/4 px-3 py-2 text-lg bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>
    <div class="flex items-center">
      <label for="email" class="w-1/4 text-lg">Email address:</label>
      <input type="email" id="email" bind:value={email} required class="w-3/4 px-3 py-2 text-lg bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>
    <div class="flex items-center">
      <label for="paypalAddress" class="w-1/4 text-lg">PayPal address:</label>
      <input type="email" id="paypalAddress" bind:value={paypalAddress} required class="w-3/4 px-3 py-2 text-lg bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>
    <div class="flex justify-start">
      <button type="submit" class="px-6 py-3 text-lg text-white bg-[#43a7ab] rounded-md hover:bg-[#2b8c90] focus:outline-none focus:ring-2 focus:ring-[#43a7ab] focus:ring-opacity-50 transition duration-200">Update account details</button>
    </div>
  </form>
</div>
