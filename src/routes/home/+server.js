import { json } from '@sveltejs/kit';

export async function GET({ platform, cookies }) {
  const email = cookies.get('session');
  if (!email) {
    return json({ error: 'Not logged in' }, { status: 401 });
  }

  try {
    const user = await platform.env.DB.prepare("SELECT * FROM User WHERE email = ?").bind(email).first();
    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    const links = await platform.env.DB.prepare("SELECT * FROM Link WHERE owner = ?").bind(email).all();
    
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sales7Days = await platform.env.DB.prepare("SELECT SUM(price) as total FROM Purchase WHERE owner = ? AND create_date > ?").bind(email, sevenDaysAgo.toISOString()).first();
    const sales30Days = await platform.env.DB.prepare("SELECT SUM(price) as total FROM Purchase WHERE owner = ? AND create_date > ?").bind(email, thirtyDaysAgo.toISOString()).first();
    const salesTotal = await platform.env.DB.prepare("SELECT SUM(price) as total FROM Purchase WHERE owner = ?").bind(email).first();

    return json({
      links: links.results,
      sales: {
        last7Days: sales7Days.total || 0,
        last30Days: sales30Days.total || 0,
        total: salesTotal.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}