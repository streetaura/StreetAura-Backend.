// Install Express and Stripe via Vercel
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { items } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100, // Amount in cents
          },
          quantity: 1, // If you want to support different quantities, you can adjust this.
        })),
        mode: 'payment',
        success_url: `${req.headers.origin}/success`, // Correct string interpolation
        cancel_url: `${req.headers.origin}/cancel`, // Correct string interpolation
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
