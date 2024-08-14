import { json } from '@sveltejs/kit';

export async function GET({ params, platform, cookies }) {
  const email = cookies.get('session');
  if (!email) {
    return json({ error: 'Not logged in' }, { status: 401 });
  }

  const { permalink } = params;

  try {
    const link = await platform.env.DB.prepare("SELECT * FROM Link WHERE unique_permalink = ? AND owner = ?")
      .bind(permalink, email)
      .first();

    if (!link) {
      return json({ error: 'Link not found' }, { status: 404 });
    }

    return json(link);
  } catch (error) {
    console.error('Error fetching link:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT({ params, request, platform, cookies }) {
  const email = cookies.get('session');
  if (!email) {
    return json({ error: 'Not logged in' }, { status: 401 });
  }

  const { permalink } = params;
  const { name, price, url, description } = await request.json();

  if (!name || !price || !url) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const result = await platform.env.DB.prepare("UPDATE Link SET name = ?, price = ?, url = ?, description = ? WHERE unique_permalink = ? AND owner = ?")
      .bind(name, price, url, description, permalink, email)
      .run();

    if (result.changes === 0) {
      return json({ error: 'Link not found or you do not have permission to edit it' }, { status: 404 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Error updating link:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE({ params, platform, cookies }) {
  const email = cookies.get('session');
  if (!email) {
    return json({ error: 'Not logged in' }, { status: 401 });
  }

  const { permalink } = params;

  try {
    const result = await platform.env.DB.prepare("DELETE FROM Link WHERE unique_permalink = ? AND owner = ?")
      .bind(permalink, email)
      .run();

    if (result.changes === 0) {
      return json({ error: 'Link not found or you do not have permission to delete it' }, { status: 404 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}