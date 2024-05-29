const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


export default async function handler(req, res) {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseFloat(amount)*100,
    currency: "ron",

    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    price: paymentIntent.amount
  });

};