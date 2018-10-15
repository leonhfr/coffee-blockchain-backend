const models = require('../models');

exports.createTransaction = async ctx => {
  ctx.body = await models.transaction.createTransaction(ctx.request.body);
  if (ctx.body) return (ctx.status = 201);
  ctx.status = 404;
};

exports.getTransaction = async ctx => {
  ctx.body = await models.transaction.getCustomerAndTransactions(ctx.params.id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.getAllTransactions = async ctx => {
  ctx.body = await models.transaction.getAllTransactions();
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};
