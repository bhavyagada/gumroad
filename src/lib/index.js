import { browser } from "$app/environment";
import { writable } from "svelte/store";

const initialAuth = browser && localStorage.auth ? JSON.parse(localStorage.auth) : false;
const initialUser = browser && localStorage.user ? JSON.parse(localStorage.user) : {};

export const is_logged_in = writable(initialAuth);
export const user_store = writable(initialUser);

if (browser) {
  is_logged_in.subscribe((value) => (localStorage.auth = JSON.stringify(value)));
  user_store.subscribe((value) => (localStorage.user = JSON.stringify(value)));
}
