const models = require('../models');

exports.createCoffee = async ctx => {
  console.log(ctx.request.body, ctx.request.header.authorization);
  let coffee = {
    ...ctx.request.body,
    producerId: ctx.request.header.authorization.split(' ')[1]
  };
  ctx.body = await models.coffee.createCoffee(coffee);
  if (ctx.body) return (ctx.status = 201);
  ctx.status = 404;
};

exports.getCoffee = async ctx => {
  ctx.body = await models.coffee.getCoffee(ctx.params.coffeeId);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.updateCoffee = async ctx => {
  let id = ctx.request.header.id;
  ctx.body = await models.coffee.updateCoffee(id, ctx.request.body);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.filterCoffees = async ctx => {
  let filter = ctx.params.filter;
  let value = ctx.params.value;
  ctx.body = await models.coffee.filterCoffees(filter, value);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.getCoffees = async ctx => {
  ctx.body = await models.coffee.getCoffees();
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};
