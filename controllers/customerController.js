const models = require('../models');

exports.createCustomer = async ctx => {
  console.log(ctx.request.body);
  ctx.body = await models.customer.createCustomer(ctx.request.body);
  if (ctx.body) return (ctx.status = 201);
  ctx.status = 404;
};

exports.getCustomer = async ctx => {
  ctx.body = await models.customer.getCustomer(ctx.params.id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.filterCustomers = async ctx => {
  let filter = ctx.params.filter;
  let value = ctx.params.value;
  ctx.body = await models.customer.filterCustomers(filter, value);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.getCustomers = async ctx => {
  ctx.body = await models.customer.getCustomers();
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};
