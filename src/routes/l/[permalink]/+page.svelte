<script>
  import { page } from '$app/stores';
  import { user_store } from '$lib';

  export let data;

  let cardNumber = '';
  let cardExpiryMonth = 'August';
  let cardExpiryYear = '2024';
  let cardSecurityCode = '';
  let errorMessage = '';

  function validateForm() {
    // Reset error message
    errorMessage = '';

    // Validate card number (simple check for 16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
      errorMessage = 'Card number must be 16 digits';
      return false;
    }

    // Validate security code (3 or 4 digits)
    if (!/^\d{3,4}$/.test(cardSecurityCode)) {
      errorMessage = 'Security code must be 3 or 4 digits';
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`/l/${$page.params.permalink}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          permalink: $page.params.permalink,
          cardNumber, 
          cardExpiryMonth, 
          cardExpiryYear, 
          cardSecurityCode 
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Update the user_store with the new balance
        if (result.updatedBalance !== undefined) {
          $user_store.balance = result.updatedBalance;
        }
        // window.location.href = result.url; // Redirect to the purchased content
        window.location.href = "https://www.google.com" // Redirect to google.com for testing
      } else {
        errorMessage = result.error || 'An error occurred while processing your payment';
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      errorMessage = 'An error occurred while processing your payment';
    }
  }
</script>

<svelte:head>
  <title>Gumroad - {data.name}</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8 text-center">
  <h1 class="text-4xl text-[#6A4A3C] font-bold mb-1">Gumroad</h1>
  <h2 class="text-xl text-gray-500 font-normal mb-6">You're being shared {data.name}!</h2>

  <div class="bg-gray-100 p-4 rounded-lg mb-6">
    <p>{data.description}</p>
  </div>

  <div class="bg-gray-700 text-white p-6 rounded-lg mb-6">
    <h3 class="text-xl mb-4">Pay ${data.price} to be redirected to it:</h3>
    {#if errorMessage}
      <p class="text-red-500 mb-4">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label for="cardNumber" class="block text-left mb-1">Card Number:</label>
        <input type="text" id="cardNumber" bind:value={cardNumber} placeholder="1234567890123456" class="w-full p-2 text-gray-700 rounded" required maxlength="16">
      </div>
      <div class="flex space-x-4">
        <div class="flex-1">
          <label for="cardExpiryMonth" class="block text-left mb-1">Card Expiry Date:</label>
          <select id="cardExpiryMonth" bind:value={cardExpiryMonth} class="w-full p-2 text-gray-700 rounded">
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </div>
        <div class="flex-1">
          <label for="cardExpiryYear" class="block text-left mb-1">&nbsp;</label>
          <select id="cardExpiryYear" bind:value={cardExpiryYear} class="w-full p-2 text-gray-700 rounded">
            <option>2024</option>
            <option>2025</option>
            <option>2026</option>
            <option>2027</option>
            <option>2028</option>
            <option>2029</option>
            <option>2030</option>
          </select>
        </div>
      </div>
      <div>
        <label for="cardSecurityCode" class="block text-left mb-1">Card Security Code:</label>
        <input type="text" id="cardSecurityCode" bind:value={cardSecurityCode} placeholder="123" class="w-full p-2 text-gray-700 rounded" required maxlength="4">
      </div>
      <button type="submit" class="w-full bg-yellow-500 text-gray-700 font-bold py-2 px-4 rounded hover:bg-yellow-400">Pay!</button>
    </form>
  </div>

  <p class="text-blue-500 hover:underline cursor-pointer">or you can pay using PayPal!</p>
</div>

<footer class="text-center text-sm text-gray-500 mt-8">
  <p>Copyright © 2011 Little Big Things, LLC.</p>
  <p>A project by Sahil Lavingia.</p>
</footer>