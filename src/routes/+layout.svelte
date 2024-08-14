<script>
  import "../app.css";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { is_logged_in, user_store } from "$lib";

  function logout() {
    $is_logged_in = false;
    $user_store = null;
    goto("/");
  }
</script>

<svelte:head>
  <title>{$page.data.title || "Gumroad - Selling should be as easy as sharing a link."}</title>
  <meta property="og:site_name" content="Gumroad" />
  <meta property="og:title" content="Gumroad" />
  <meta property="og:url" content="http://gumroad.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:description" content="Selling should be as easy as sharing a link." />
  <meta property="fb:page_id" content="http://www.facebook.com/gumroad" />
</svelte:head>

<body id={$page.data.body_id} class="font-sans text-gray-700 text-base bg-white">
  <div class="w-full">
    <div class="flex h-1 overflow-hidden">
      <div class="w-1/5 h-24 bg-[#00A0B0]"></div>
      <div class="w-1/5 h-24 bg-[#6A4A3C]"></div>
      <div class="w-1/5 h-24 bg-[#CC333F]"></div>
      <div class="w-1/5 h-24 bg-[#EB6841]"></div>
      <div class="w-1/5 h-24 bg-[#EDC951]"></div>
    </div>
  </div>

  {#if $page.data.hide_header === undefined}
    <div class="max-w-4xl mx-auto px-4">
      <header class="flex justify-between items-center py-6 border-b border-dashed border-gray-200">
        <div>
          <a href="/"><h1 class="text-4xl text-[#6A4A3C] font-bold mb-1">Gumroad</h1></a>
          <h2 class="text-xl text-gray-500 font-normal">Share and sell your digital goods with just a link.</h2>
        </div>
        <nav>
          <ul class="flex space-x-5">
            {#if $is_logged_in}
              <li><a href="/account" class="text-blue-600 hover:underline">Account</a></li>
              <li><span class="text-gray-500">$0.00</span></li>
              <li><button on:click={logout} class="text-blue-600 hover:underline">Logout</button></li>
            {:else}
              <li><a href="/login" class="text-blue-600 hover:underline">Have an account? Login!</a></li>
            {/if}
          </ul>
        </nav>
      </header>
    </div>
  {/if}

  <div class="max-w-4xl mx-auto px-4">
    <slot />
  </div>

  {#if $page.data.hide_footer === undefined}
    <div class="max-w-4xl mx-auto px-4">
      <footer class="border-t border-dashed border-gray-200 py-4 mt-8 flex justify-between items-center">
        <nav>
          <ul class="flex space-x-4">
            <li><a href="/about" class="text-gray-600 hover:underline">About</a></li>
            <li><a href="/faq" class="text-gray-600 hover:underline">FAQ</a></li>
          </ul>
        </nav>
        <div class="text-sm text-gray-500">
          <p>Copyright © 2011 Little Big Things, LLC.</p>
          <p>A project by Sahil Lavingia.</p>
        </div>
      </footer>
    </div>
  {/if}
</body>
