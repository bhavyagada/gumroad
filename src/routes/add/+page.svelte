<script>
  import { goto } from '$app/navigation';
  import { is_logged_in } from '$lib';
  import { onMount } from 'svelte';

  let name = "";
  let price = "";
  let url = "";
  let description = "";
  let errorMessage = "";
  let links = [];
  let loading = true;
  let error = null;

  async function fetchLinks() {
    try {
      const response = await fetch("/home");
      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }
      const data = await response.json();
      links = data.links;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    if (!$is_logged_in) {
      goto("/login");
    } else {
      await fetchLinks();
    }
  });

  async function handleSubmit() {
    errorMessage = "";
    try {
      const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, url, description })
      });
      const data = await response.json();
      if (response.ok) {
        // Refresh the links after successful creation
        await fetchLinks();
        // Clear the form
        name = "";
        price = "";
        url = "";
        description = "";
        goto("/edit/" + data.permalink);
      } else {
        errorMessage = data.error || 'An error occurred while creating the link';
      }
    } catch (error) {
      console.error('Error creating link:', error);
      errorMessage = 'An error occurred while creating the link';
    }
  }
</script>

<svelte:head>
  <title>Gumroad - Add Link</title>
</svelte:head>

<main class="py-8 flex justify-between">
  <div class="w-1/3 flex flex-col items-center pr-8">
    <button on:click={() => goto("/home")} class="bg-[#0e7bba] text-white font-bold py-2 px-4 rounded-md hover:bg-[#0a547f] transition duration-200 ease-in-out shadow-md mb-4">Back to home</button>
    {#if loading}
      <p class="mt-4 text-gray-600">Loading...</p>
    {:else if error}
      <p class="mt-4 text-red-500">{error}</p>
    {:else if links.length === 0}
      <p class="mt-4 text-gray-600">You don't have any links.</p>
    {:else}
      <ul class="mt-4 w-full text-center">
        {#each links as link}
          <li class="mb-2">
            <a href="/edit/{link.permalink}" class="text-blue-600 hover:underline">{link.name}</a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="w-2/3 bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
    <h2 class="text-2xl font-bold text-center mb-4">Create a new link:</h2>
    {#if errorMessage}
      <p class="text-red-500 mb-4">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
        <input type="text" id="name" bind:value={name} placeholder="name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
      </div>
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">Price:</label>
        <input type="number" id="price" bind:value={price} min="0.99" max="999" step="0.01" placeholder="10" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
      </div>
      <div>
        <label for="url" class="block text-sm font-medium text-gray-700">URL:</label>
        <input type="url" id="url" bind:value={url} placeholder="http://" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description: <small class="text-gray-500">(optional)</small></label>
        <textarea id="description" bind:value={description} rows="4" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
      </div>
      <div>
        <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Create Link!</button>
      </div>
    </form>
  </div>
</main>