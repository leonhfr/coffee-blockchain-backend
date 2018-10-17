const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require('stripe')(keySecret);

/* exports.charge = async ctx => {
  console.log(ctx.request.body);
  stripe.customers
    .create({
      card: ctx.request.body.card,
      email: 'bob@bob.com'
    })
    .then(customer => {
      console.log('customer: ', customer);
      stripe.charges.create({
        amount: 500,
        description: 'test',
        currency: 'usd',
        customer: customer.id,
        source: token.id
      });
    })
    .then(charge => {
      ctx.status = 200;
      ctx.body = charge;
    })
    .catch(err => {
      console.log('Error: ', err);
      ctx.status = 500;
      ctx.body = { error: 'Purchase failed' };
    });
}; */

exports.charge = async ctx => {
  let res = await stripe.charges
    .create({
      amount: 100,
      currency: 'usd',
      source: ctx.request.body.id
    })
    .then(function (charge) {
      console.log('charge: ', charge);
      return charge;
    });
  ctx.body = res;
};
