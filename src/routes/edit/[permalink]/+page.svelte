<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let name = 'Pencil icon';
  let price = '1.99';
  let url = 'http://sahillavingia.com/pencil.psd';
  let description = 'This is a pencil icon I worked on for about six hours.';
  let permalink = $page.params.permalink;
  let views = 0;
  let downloads = 0;
  let profit = 0;

  function handleSubmit() {
    // TODO: Implement link update logic
    console.log('Updating link:', { name, price, url, description });
    // After updating, navigate back to home
    goto("/home");
  }

  function handleDelete() {
    // TODO: Implement link deletion logic
    console.log('Deleting link:', permalink);
    // After deleting, navigate back to home
    goto("/add");
  }
</script>

<svelte:head>
  <title>Gumroad - Edit Link</title>
</svelte:head>

<main class="py-8 flex justify-between">
  <div class="w-1/3 flex flex-col items-center pr-8">
    <button on:click={() => goto("/add")} class="bg-[#0e7bba] text-white font-bold py-2 px-4 rounded-md hover:bg-[#0a547f] transition duration-200 ease-in-out shadow-md">+ Add new link</button>
    <p class="mt-4 text-gray-600">You don't have any links.</p>
  </div>
  <div class="w-2/3 bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
    <div class="mt-4 space-y-2">
      <button class="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 w-full">Share on Facebook</button>
      <div class="flex items-center space-x-2">
        <span class="text-gray-600">Link to share:</span>
        <input type="text" value="http://gumrd.pages.dev/l/{permalink}" readonly class="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm flex-grow">
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