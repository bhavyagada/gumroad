export async function load({ params, fetch }) {
  const { permalink } = params;
  const response = await fetch(`/l/${permalink}`);
  
  if (!response.ok) {
    return {
      status: response.status,
      error: new Error(`Could not load link ${permalink}`)
    };
  }

  const linkData = await response.json();

  return {
    ...linkData,
    hide_header: true,
    hide_footer: true
  };
}