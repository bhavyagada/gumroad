<script>
  import { goto } from "$app/navigation";
  import { is_logged_in, user_store } from "$lib";
  import { onMount } from "svelte";

  onMount(() => {
    if ($is_logged_in) {
      goto("/home");
    }
  });

  let email = "";
  let password = "";
  let errorMessage = "";

  const handleSignup = async () => {
    errorMessage = "";
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    console.log(data);
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

<main class="py-8 flex justify-between">
  <div class="w-1/2 pr-8">
    <ol class="space-y-6">
      <li class="flex items-start">
        <span class="bg-[#EDC951] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</span>
        <div>
          <h3 class="text-xl font-bold text-black mb-1">Take a file or a link of value.</h3>
          <p class="text-gray-600">This can be anything. From a link to an exclusive build of an app, to a secret blog post, to an icon you spent hours designing.</p>
        </div>
      </li>
      <li class="flex items-start">
        <span class="bg-[#EB6841] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</span>
        <div>
          <h3 class="text-xl font-bold text-black mb-1">Share it.</h3>
          <p class="text-gray-600">Just like any old link. Choose your own price. You don't have to create a store. And you don't have to do <em>any</em> management. <a href="https://gumrd.pages.dev/l/hjbaod" class="text-blue-600 hover:underline">Click here</a> for an example.</p>
        </div>
      </li>
      <li class="flex items-start">
        <span class="bg-[#CC333F] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</span>
        <div>
          <h3 class="text-xl font-bold text-black mb-1">Make money.</h3>
          <p class="text-gray-600">And that's it. At the end of each month we'll deposit the money you've earned to your PayPal account.</p>
        </div>
      </li>
    </ol>
  </div>
  <div class="w-1/2 bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
    <h2 class="text-2xl font-bold text-center mb-4">Create an account in seconds:</h2>
    {#if errorMessage}
      <p class="text-red-500">{errorMessage}</p>
    {/if}
    <form class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-bold text-gray-700 mb-1">Email address:</label>
        <input type="email" id="email" bind:value={email} class="w-full p-2 border border-gray-300 rounded" />
      </div>
      <div>
        <label for="password" class="block text-sm font-bold text-gray-700 mb-1">Password:</label>
        <input type="password" id="password" bind:value={password} class="w-full p-2 border border-gray-300 rounded" />
      </div>
      <button type="submit" on:click|preventDefault={handleSignup} class="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700">Start Making Money</button>
    </form>
  </div>
</main>
