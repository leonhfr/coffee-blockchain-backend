const model = require('../models/model');

// me //

exports.getMe = async ctx => {
  let id = ctx.request.header.authorization.split(' ')[1];
  ctx.body = await model.getMe(id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.updateMe = async ctx => {
  let id = ctx.request.header.authorization.split(' ')[1];
  ctx.body = await model.updateMe(id, ctx.request.body);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

// customer //

exports.createCustomer = async ctx => {
  ctx.body = await model.createCustomer(ctx.request.body);
  if (ctx.body) return (ctx.status = 201);
  ctx.status = 404;
};

exports.getCustomer = async ctx => {
  ctx.body = await model.getCustomer(ctx.params.id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.filterCustomers = async ctx => {
  let filter = ctx.params.filter;
  let value = ctx.params.value;
  ctx.body = await model.filterCustomers(filter, value);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.getCustomers = async ctx => {
  ctx.body = await model.getCustomers();
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

//  producer //

exports.createProducer = async ctx => {
  ctx.body = await model.createProducer(ctx.request.body);
  if (ctx.body) return (ctx.status = 201);
  ctx.status = 404;
};

exports.getProducer = async ctx => {
  ctx.body = await model.getProducer(ctx.params.id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.filterProducers = async ctx => {
  let filter = ctx.params.filter;
  let value = ctx.params.value;
  ctx.body = await model.filterProducers(filter, value);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.getProducers = async ctx => {
  ctx.body = await model.getProducers();
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

// coffee //

exports.createCoffee = async ctx => {
  console.log(ctx.request.body, ctx.request.header.authorization);
  let coffee = {
    ...ctx.request.body,
    producerId: ctx.request.header.authorization.split(' ')[1]
  };
  ctx.body = await model.createCoffee(coffee);
  if (ctx.body) return (ctx.status = 201);
  ctx.status = 404;
};

exports.getCoffee = async ctx => {
  ctx.body = await model.getCoffee(ctx.params.coffeeId);
  if (ctx.body) return (ctx.status = 201);
  ctx.status = 404;
};

exports.updateCoffee = async ctx => {
  let id = ctx.request.header.id;
  ctx.body = await model.updateCoffee(id, ctx.request.body);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.filterCoffees = async ctx => {
  let filter = ctx.params.filter;
  let value = ctx.params.value;
  ctx.body = await model.filterCoffees(filter, value);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.getCoffees = async ctx => {
  ctx.body = await model.getCoffees();
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

// transaction  //

exports.createTransaction = async ctx => {
  ctx.body = await model.createTransaction(ctx.request.body);
  if (ctx.body) return (ctx.status = 201);
  ctx.status = 404;
};

exports.getTransaction = async ctx => {
  ctx.body = await model.getCustomerAndTransactions(ctx.params.id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

// extra //

exports.test = async ctx => {
  ctx.body = await model.test(ctx.params.id);
};

exports.getAll = async ctx => {
  ctx.body = await model.getAll();
};
