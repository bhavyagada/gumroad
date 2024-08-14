<script>
  import { goto } from '$app/navigation';

  let name = '';
  let price = '10';
  let url = 'http://';
  let description = '';

  function handleSubmit() {
    // TODO: Implement link creation logic
    console.log('Creating link:', { name, price, url, description });
    // After creating, navigate back to home
    goto("/home");
  }
</script>

<svelte:head>
  <title>Gumroad - Add Link</title>
</svelte:head>

<main class="py-8 flex justify-between">
  <div class="w-1/3 flex flex-col items-center pr-8">
    <button on:click={() => goto("/add")} class="bg-[#0e7bba] text-white font-bold py-2 px-4 rounded-md hover:bg-[#0a547f] transition duration-200 ease-in-out shadow-md">+ Add new link</button>
    <p class="mt-4 text-gray-600">You don't have any links.</p>
  </div>
  <div class="w-2/3 bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
    <h2 class="text-2xl font-bold text-center mb-4">Create a new link:</h2>
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
        <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Create Link!</button>
      </div>
    </form>
  </div>
</main>