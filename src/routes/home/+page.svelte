<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { is_logged_in } from '$lib';

  let links = [];
  let sales = { last7Days: 0, last30Days: 0, total: 0 };
  let loading = true;
  let error = null;

  onMount(async () => {
    if (!$is_logged_in) {
      goto("/login");
      return;
    }
    try {
      const response = await fetch("/home");
      if (!response.ok) {
        throw new Error('Failed to fetch home data');
      }
      const data = await response.json();
      links = data.links;
      sales = data.sales;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Gumroad - Home</title>
</svelte:head>

<main class="py-8 flex justify-between">
  <div class="w-1/3 flex flex-col items-center pr-8">
    <button on:click={() => goto("/add")} class="bg-[#0e7bba] text-white font-bold py-2 px-4 rounded-md hover:bg-[#0a547f] transition duration-200 ease-in-out shadow-md">+ Add new link</button>
    {#if loading}
      <p class="mt-4 text-gray-600">Loading...</p>
    {:else if error}
      <p class="mt-4 text-red-500">{error}</p>
    {:else if links.length === 0}
      <p class="mt-4 text-gray-600">You don't have any links.</p>
    {:else}
      <ul class="mt-4 w-full">
        {#each links as link}
          <li class="mb-2">
            <a href="/edit/{link.permalink}" class="text-blue-600 hover:underline">{link.name}</a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="w-2/3 bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
    <h2 class="text-2xl font-bold text-center mb-4">Last 30 days:</h2>
    {#if loading}
      <p class="text-gray-600 text-center">Loading...</p>
    {:else if error}
      <p class="text-red-500 text-center">{error}</p>
    {:else}
      <h3 class="text-xl font-bold mt-6">History:</h3>
      <p class="text-gray-600">${sales.last7Days.toFixed(2)} in the past 7 days.</p>
      <p class="text-gray-600">${sales.last30Days.toFixed(2)} in the past month.</p>
      <p class="text-gray-600">${sales.total.toFixed(2)} in total.</p>
    {/if}
  </div>
</main>