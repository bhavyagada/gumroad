<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { is_logged_in, user_store } from '$lib';

  let user;

  onMount(() => {
    user_store.subscribe(value => {
      user = value;
    });
  });
</script>

<svelte:head>
  <title>Gumroad - Home</title>
</svelte:head>

<main class="py-8 flex justify-between">
  <div class="w-1/3 flex flex-col items-center pr-8">
    <button on:click={() => goto("/add")} class="bg-[#0e7bba] text-white font-bold py-2 px-4 rounded-md hover:bg-[#0a547f] transition duration-200 ease-in-out shadow-md">+ Add new link</button>
    <p class="mt-4 text-gray-600">You don't have any links.</p>
  </div>
  <div class="w-2/3 bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
    <h2 class="text-2xl font-bold text-center mb-4">Last 0 days:</h2>
    <p class="text-gray-600 text-center">Wait a few days and a chart will show up here!</p>
    <h3 class="text-xl font-bold mt-6">History:</h3>
    <p class="text-gray-600">$0.00 in the past 7 days.</p>
    <p class="text-gray-600">$0.00 in the past month.</p>
    <p class="text-gray-600">$0.00 in total.</p>
  </div>
</main>