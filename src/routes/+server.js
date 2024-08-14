import { json } from '@sveltejs/kit';
import { pbkdf2Sync, randomBytes } from 'crypto';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, platform, cookies }) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return json({ error_message: 'Fill in the form please!' }, { status: 400 });
  }

  const users_from_db = await platform.env.DB.prepare("SELECT * FROM User WHERE email = ?").bind(email).run();

  if (users_from_db.results.length > 0) {
    // User already exists, attempt login
    const user = users_from_db.results[0];
    const stored_password_hash = user.password;
    const salt = user.salt; // Assuming salt is stored in the database

    const input_password_hash = pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');

    if (input_password_hash !== stored_password_hash) {
      return json({ error_message: 'Incorrect password for existing account!' }, { status: 400 });
    }

    // Passwords match, proceed with login
    cookies.set('session', email, { 
      path: '/', 
      httpOnly: true, 
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return json({
      user: {
        email: user.email,
        permalink: user.reset_hash, // Assuming reset_hash is used as permalink
        balance: user.balance
      }
    }, { status: 200 });
  }

  // New user, proceed with signup
  const salt = randomBytes(16).toString('hex');
  const password_hash = pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');

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

  await platform.env.DB.prepare("INSERT INTO User (email, password, salt, reset_hash) VALUES (?, ?, ?, ?)").bind(email, password_hash, salt, permalink).run();

  cookies.set('session', email, { 
    path: '/', 
    httpOnly: true, 
    sameSite: 'strict', 
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  return json({
    user: {
      email: email,
      permalink: permalink,
      balance: 0.00
    }
  }, { status: 200 });
}
