const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require('stripe')(keySecret);

exports.charge = async ctx => {
  let amount = ctx.request.body.amount;
  stripe.customers
    .create({
      email: ctx.request.body.email,
      card: ctx.request.body.card
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: 'test',
        currency: 'usd',
        customer: customer.id
      })
    )
    .then(charge => (ctx.body = charge))
    .catch(err => {
      console.log('Error: ', err);
      ctx.status = 500;
      ctx.body = { error: 'Purchase failed' };
    });
};
