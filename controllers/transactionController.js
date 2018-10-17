const models = require('../models');

exports.createTransaction = async ctx => {
  ctx.body = await models.transaction.createTransaction(ctx.request.body);
  if (!ctx.body.error) return (ctx.status = 201);
  ctx.status = 403;
};

exports.getTransactions = async ctx => {
  const id = ctx.request.header.authorization.split(' ')[1];
  ctx.body = await models.transaction.getCustomerAndTransactions(id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.updateTransaction = async ctx => {
  const id = ctx.params.id;
  ctx.body = await models.transaction.updateTransaction(ctx.request.body, id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.getSpecificTransaction = async ctx => {
  const id = ctx.params.id;
  ctx.body = await models.transaction.getSpecificTransaction(id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};
