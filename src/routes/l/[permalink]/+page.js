import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
  const { permalink } = params;
  const response = await fetch(`/l/${permalink}`);
  
  if (!response.ok) {
    throw error(response.status, response.statusText);
  }

  const linkData = await response.json();

  return {
    ...linkData,
    hide_header: true,
    hide_footer: true
  };
}