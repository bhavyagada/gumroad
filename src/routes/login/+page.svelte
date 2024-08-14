<script>
  import { goto } from "$app/navigation";
  import { is_logged_in, user_store } from "$lib";

  let email = "";
  let password = "";
  let errorMessage = "";

  const handleLogin = async () => {
    errorMessage = "";
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      $is_logged_in = true;
      $user_store = {
        email: data.user.email,
        permalink: data.user.permalink,
        balance: data.user.balance
      };
      goto("/home");
    } else {
      errorMessage = data.error_message;
    }
  }
</script>

<svelte:head>
  <title>Gumroad - Login</title>
</svelte:head>

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-gray-800 mb-6">Login to Gumroad</h2>
  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}
  <form on:submit|preventDefault={handleLogin} class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email address:</label>
      <input type="email" id="email" bind:value={email} required class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
      <input type="password" id="password" bind:value={password} required class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
    </div>
    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Login</button>
  </form>
  <div class="mt-6 text-center">
    <p class="text-sm text-gray-600">Don't have an account? <a href="/" class="text-blue-600"><u>Sign up</u></a></p>
  </div>
</div>
