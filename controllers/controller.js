const model = require('../models/model');

// customer //

exports.createCustomer = async ctx => {
  ctx.body = await model.createCustomer(ctx.request.body);
  ctx.status = 201;
};

exports.getCustomer = async ctx => {
  ctx.body = await model.getCustomer(ctx.params.id);
  ctx.status = 200;
};

exports.updateCustomer = async ctx => {
  let id = ctx.request.header.id;
  ctx.body = await model.updateCustomer(id, ctx.request.body);
  ctx.status = 200;
};

//  producer //

exports.createProducer = async ctx => {
  ctx.body = await model.createProducer(ctx.request.body);
  ctx.status = 201;
};

exports.getProducer = async ctx => {
  ctx.body = await model.getProducer(ctx.params.id);
  ctx.status = 200;
};

exports.updateProducer = async ctx => {
  let id = ctx.request.headers.id;
  ctx.body = await model.updateProducer(id, ctx.request.body);
  ctx.status = 200;
};

// coffee //

exports.createCoffee = async ctx => {
  let coffee = {
    ...ctx.request.body,
    producerId: ctx.params.producerId
  };
  ctx.body = await model.createCoffee(coffee);
  ctx.status = 201;
};

exports.getCoffee = async ctx => {
  ctx.body = await model.getCoffee(ctx.params.coffeeId);
  ctx.status = 200;
};

exports.updateCoffee = async ctx => {
  let id = ctx.request.headers.id;
  ctx.body = await model.updateCoffee(id, ctx.request.body);
  ctx.status = 200;
};

// transaction  //

exports.createTransaction = async ctx => {
  ctx.body = await model.createTransaction(ctx.request.body);
  ctx.status = 201;
};

exports.getTransaction = async ctx => {
  ctx.body = await model.getCustomerAndTransactions(ctx.params.id);
  ctx.status = 200;
};

// extra //

exports.test = async ctx => {
  ctx.body = await model.test(ctx.params.id);
};

exports.getAll = async ctx => {
  ctx.body = await model.getAll();
};
