const models = require('../models');

exports.createProducer = async ctx => {
  ctx.body = await models.producer.createProducer(ctx.request.body);
  if (ctx.body) return (ctx.status = 201);
  ctx.status = 404;
};

exports.getProducer = async ctx => {
  ctx.body = await models.producer.getProducer(ctx.params.id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.filterProducers = async ctx => {
  let filter = ctx.params.filter;
  let value = ctx.params.value;
  ctx.body = await models.producer.filterProducers(filter, value);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.getProducers = async ctx => {
  ctx.body = await models.producer.getProducers();
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};
