<script>
  import { onMount } from 'svelte';
  import { user_store } from '$lib';

  let fullName = '';
  let email = '';
  let paypalAddress = '';
  let balance = 0;
  let errorMessage = '';
  let successMessage = '';

  onMount(async () => {
    try {
      const response = await fetch('/account');
      if (response.ok) {
        const userData = await response.json();
        fullName = userData.fullName;
        email = userData.email;
        paypalAddress = userData.paypalAddress;
        balance = userData.balance;
        user_store.set(userData);
      } else {
        errorMessage = 'Failed to fetch user data';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      errorMessage = 'An error occurred while fetching user data';
    }
  });

  async function updateAccount() {
    errorMessage = '';
    successMessage = '';
    try {
      const response = await fetch('/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, paypalAddress })
      });

      if (response.ok) {
        const result = await response.json();
        successMessage = result.message;
        user_store.update(store => ({ ...store, fullName, paypalAddress }));
      } else {
        const error = await response.json();
        errorMessage = error.error || 'Failed to update account details';
      }
    } catch (error) {
      console.error('Error updating account:', error);
      errorMessage = 'An error occurred while updating account details';
    }
  }
</script>

<svelte:head>
  <title>Gumroad - Account</title>
</svelte:head>

<div class="bg-white p-8 rounded-t-lg border border-gray-300 shadow-md">
  <h3 class="text-2xl font-bold text-gray-800 mb-4">Your account settings</h3>
  {#if errorMessage}
    <p class="text-red-500 mb-4">{errorMessage}</p>
  {/if}
  {#if successMessage}
    <p class="text-green-500 mb-4">{successMessage}</p>
  {/if}
  <form on:submit|preventDefault={updateAccount} class="space-y-6">
    <div class="flex items-center">
      <label for="fullName" class="w-1/4 text-lg">Full name:</label>
      <input type="text" id="fullName" bind:value={fullName} required class="w-3/4 px-3 py-2 text-lg bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>
    <div class="flex items-center">
      <label for="email" class="w-1/4 text-lg">Email address:</label>
      <input type="email" id="email" bind:value={email} required readonly class="w-3/4 px-3 py-2 text-lg bg-gray-200 border border-gray-300 rounded-md">
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