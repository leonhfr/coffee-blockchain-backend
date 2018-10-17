const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require('stripe')(keySecret);

exports.charge = async ctx => {
  let res = await stripe.charges
    .create({
      amount: 100,
      currency: 'usd',
      source: ctx.request.body.id
    })
    .then(function (charge) {
      return charge;
    });
  ctx.body = res;
};
