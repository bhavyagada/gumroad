import { json } from '@sveltejs/kit';
import { pbkdf2Sync } from 'node:crypto';

export async function POST({ request, platform, cookies }) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return json({ error_message: "Fill in the form please!" }, { status: 400 });
  }

  const user_from_db = await platform.env.DB.prepare("SELECT * FROM user WHERE email = ?").bind(email).run();
  if (user_from_db.results.length === 0) {
    return json({ error_message: "That email address isn't being used!" }, { status: 400 });
  }

  const user = user_from_db.results[0];
  const password_hash = pbkdf2Sync(password, user.salt, 10000, 64, 'sha256').toString('hex');
  if (password_hash !== user.password) {
    return json({ error_message: "Wrong credentials, please try again!" }, { status: 400 });
  }

  cookies.set("session", user.email, { path: '/', httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 30 });
  return json({
    user: {
      email: user.email,
      permalink: user.reset_hash,
      balance: user.balance
    }
  }, { status: 200 });
}
