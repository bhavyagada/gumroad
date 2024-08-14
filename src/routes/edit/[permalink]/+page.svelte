<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { is_logged_in } from '$lib';

  let name = '';
  let price = '';
  let url = '';
  let description = '';
  let permalink = $page.params.permalink;
  let views = 0;
  let downloads = 0;
  let profit = 0;
  let links = [];
  let loading = true;
  let error = null;
  let errorMessage = '';

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

  async function fetchLinkDetails() {
    try {
      const response = await fetch(`/edit/${permalink}`);
      if (!response.ok) {
        throw new Error('Failed to fetch link details');
      }
      const data = await response.json();
      name = data.name;
      price = data.price;
      url = data.url;
      description = data.description;
      views = data.number_of_views;
      downloads = data.number_of_downloads;
      profit = data.balance;
    } catch (err) {
      error = err.message;
    }
  }

  onMount(async () => {
    if (!$is_logged_in) {
      goto("/login");
    } else {
      await Promise.all([fetchLinks(), fetchLinkDetails()]);
    }
  });

  async function handleSubmit() {
    errorMessage = "";
    try {
      const response = await fetch(`/edit/${permalink}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, url, description })
      });
      const data = await response.json();
      if (response.ok) {
        await fetchLinks();
        await fetchLinkDetails(); // Update link details after successful update
      } else {
        errorMessage = data.error || 'Failed to update link';
      }
    } catch (err) {
      errorMessage = 'An error occurred while updating the link';
    }
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        const response = await fetch(`/edit/${permalink}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          goto("/home");
        } else {
          errorMessage = 'Failed to delete link';
        }
      } catch (err) {
        errorMessage = 'An error occurred while deleting the link';
      }
    }
  }
</script>

<svelte:head>
  <title>Gumroad - Edit Link</title>
</svelte:head>

<main class="py-8 flex justify-between">
  <div class="w-1/3 flex flex-col items-center pr-8">
    <button on:click={() => goto("/add")} class="bg-[#0e7bba] text-white font-bold py-2 px-4 rounded-md hover:bg-[#0a547f] transition duration-200 ease-in-out shadow-md mb-4">+ Add new link</button>
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
            <a href="/edit/{link.unique_permalink}" class="text-blue-600 hover:underline">{link.name}</a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="w-2/3 bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
    <div class="mt-4 space-y-2">
      <button class="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 w-full">Share on Facebook</button>
      <div class="flex items-center space-x-2">
        <span class="text-gray-600">Link to share:</span>
        <input type="text" value="http://localhost:5173/l/{permalink}" readonly class="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm flex-grow">
      </div>
      <button class="bg-blue-400 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 w-full">Share on Twitter</button>
    </div>
    <div class="text-center my-6 text-gray-600">
      <p>{views} views → 
        {#if views > 0}
          {(downloads / views * 100).toFixed(1)}%
        {:else}
          0%
        {/if} → {downloads} downloads at ${price} → ${profit.toFixed(2)} in profit!</p>
    </div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Edit link:</h2>
      <button on:click={handleDelete} class="text-red-500 hover:underline">delete</button>
    </div>
    {#if errorMessage}
      <p class="text-red-500 mb-4">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
        <input type="text" id="name" bind:value={name} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
      </div>
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">Price:</label>
        <input type="number" id="price" bind:value={price} min="0.99" max="999" step="0.01" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
      </div>
      <div>
        <label for="url" class="block text-sm font-medium text-gray-700">URL:</label>
        <input type="url" id="url" bind:value={url} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
      </div>
      <div>
        <label for="file" class="block text-sm font-medium text-gray-700">or upload a file:</label>
        <input type="file" id="file" class="mt-1 block w-full">
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description:</label>
        <textarea id="description" bind:value={description} rows="4" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
      </div>
      <div>
        <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Update Link</button>
      </div>
    </form>
  </div>
</main>