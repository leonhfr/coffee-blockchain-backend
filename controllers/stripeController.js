const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require('stripe')(keySecret);
const models = require('../models');

exports.charge = async ctx => {
  let res = await stripe.charges
    .create({
      amount: ctx.request.body.amount * 100,
      currency: 'usd',
      source: ctx.request.body.id
    })
    .then(function (charge) {
      models.transaction.updateTransaction(
        { status_code: 1 },
        ctx.request.body.transactionId
      );
      return charge;
    });
  ctx.body = res;
};
