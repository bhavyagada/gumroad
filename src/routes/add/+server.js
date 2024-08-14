import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  const email = cookies.get('session');
  if (!email) {
    return json({ error: 'Not logged in' }, { status: 401 });
  }

  const { name, price, url, description } = await request.json();

  if (!name || !price || !url) {
    return json({ error: 'Missing required fields name, price and url' }, { status: 400 });
  }

  try {
    let permalink;
    let x = 1;
    while (x === 1) {
      permalink = ((len, chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') => 
        [...Array(len)].map(() => chars.charAt(Math.random() * chars.length)).join(''))(6);
      const permalinks_from_db = await platform.env.DB.prepare("SELECT * FROM Permalink WHERE permalink = ?").bind(permalink).run();
      if (permalinks_from_db.results.length === 0) {
        await platform.env.DB.prepare("INSERT INTO Permalink (permalink) VALUES (?)").bind(permalink).run();
        x = 0;
      }
    }

    await platform.env.DB.prepare("INSERT INTO Link (name, price, url, description, unique_permalink, owner) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(name, price, url, description, permalink, email)
      .run();

    return json({ success: true, permalink });
  } catch (error) {
    console.error('Error adding link:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}