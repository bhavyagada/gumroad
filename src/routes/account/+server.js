import { json } from '@sveltejs/kit';

export async function GET({ platform, cookies }) {
  const email = cookies.get('session');
  if (!email) {
    return json({ error: 'Not logged in' }, { status: 401 });
  }

  try {
    const user = await platform.env.DB.prepare("SELECT email, name, payment_address, balance FROM User WHERE email = ?").bind(email).first();
    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    return json({
      email: user.email,
      fullName: user.name,
      paypalAddress: user.payment_address,
      balance: user.balance
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT({ platform, cookies, request }) {
  const email = cookies.get('session');
  if (!email) {
    return json({ error: 'Not logged in' }, { status: 401 });
  }

  try {
    const { fullName, paypalAddress } = await request.json();

    const result = await platform.env.DB.prepare("UPDATE User SET name = ?, payment_address = ? WHERE email = ?")
      .bind(fullName, paypalAddress, email)
      .run();

    if (result.changes === 0) {
      return json({ error: 'User not found or no changes made' }, { status: 404 });
    }

    return json({ success: true, message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
