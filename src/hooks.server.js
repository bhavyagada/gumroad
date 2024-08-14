import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  const session = event.cookies.get('session');

  if (!session && !['/', '/login', '/l/*'].some(path => event.url.pathname.startsWith(path))) {
    throw redirect(303, '/login');
  }

  if (session && ['/', '/login'].includes(event.url.pathname)) {
    throw redirect(303, '/home');
  }

  const response = await resolve(event);
  return response;
}
