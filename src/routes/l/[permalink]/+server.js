import { json } from '@sveltejs/kit';

export async function GET({ params, platform, request }) {
  const { permalink } = params;

  try {
    const link = await platform.env.DB.prepare("SELECT * FROM Link WHERE unique_permalink = ?").bind(permalink).first();

    if (!link) {
      return json({ error: 'Link not found' }, { status: 404 });
    }

    // Increment view count
    await platform.env.DB.prepare("UPDATE Link SET number_of_views = number_of_views + 1 WHERE unique_permalink = ?").bind(permalink).run();

    return json({
      permalink: link.unique_permalink,
      name: link.name,
      description: link.description,
      price: link.price,
      url: link.url,
      owner: link.owner
    });
  } catch (error) {
    console.error('Error fetching link:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST({ params, request, platform }) {
  const { permalink } = params;
  const { cardNumber, cardExpiryMonth, cardExpiryYear, cardSecurityCode } = await request.json();
  console.log(permalink, cardNumber, cardExpiryMonth, cardExpiryYear, cardSecurityCode);

  try {
    const link = await platform.env.DB.prepare("SELECT * FROM Link WHERE unique_permalink = ?").bind(permalink).first();
    
    if (!link) {
      return json({ error: 'Link not found' }, { status: 404 });
    }

    // TODO: Implement actual payment processing logic here
    // For now, we'll simulate a successful payment

    // Increment download count
    await platform.env.DB.prepare("UPDATE Link SET number_of_downloads = number_of_downloads + 1 WHERE unique_permalink = ?").bind(permalink).run();

    // Log purchase
    await platform.env.DB.prepare("INSERT INTO Purchase (owner, unique_permalink, price) VALUES (?, ?, ?)").bind(link.owner, link.unique_permalink, link.price).run();

    // Update balance
    await platform.env.DB.prepare("UPDATE Link SET balance = balance + ? WHERE unique_permalink = ?").bind(link.price, link.unique_permalink).run();
    await platform.env.DB.prepare("UPDATE User SET balance = balance + ? WHERE email = ?").bind(link.price, link.owner).run();

    // Fetch the updated user balance
    const updatedUser = await platform.env.DB.prepare("SELECT balance FROM User WHERE email = ?").bind(link.owner).first();

    return json({ success: true, url: link.url, updatedBalance: updatedUser.balance });
  } catch (error) {
    console.error('Error processing payment:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}