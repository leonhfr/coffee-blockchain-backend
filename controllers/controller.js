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
  let id = ctx.request.headers.ID;
  ctx.body = await model.updateCustomer(id, ctx.request.body);
  ctx.status = 200;
};

//  producer //

exports.createProducer = async ctx => {
  ctx.body = await model.createProducer(ctx.request.body);
  ctx.status = 201;
};

exports.getProducer = async ctx => {
  ctx.body = await model.getProducer(ctx.request.params.id);
  ctx.status = 200;
};

exports.updateProducer = async ctx => {
  let id = ctx.request.headers.ID;
  ctx.body = await model.updateProducer(id, ctx.request.body);
  ctx.status = 200;
};

// coffe //

exports.createCoffee = async ctx => {
  let coffe = { ...ctx.request.body, producerId: ctx.request.producerId };
  ctx.body = await model.createCoffee(coffe);
  ctx.status = 201;
};

exports.getCoffee = async ctx => {
  ctx.body = await model.getCoffe(ctx.request.params.coffeId);
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
