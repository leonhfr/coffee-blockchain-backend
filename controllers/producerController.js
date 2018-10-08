const producer = require('../models/producerModel');

exports.getAll = async ctx => {
  ctx.body = await producer.getAll();
};

exports.createProducer = async ctx => {
  console.log(ctx.body);
  await producer.createProducer(ctx.request.body);
  ctx.status = 201;
};

exports.createCoffe = async ctx => {
  await producer.createCoffe(ctx.request.body);
  ctx.status = 201;
};

exports.test = async ctx => {
  ctx.body = await producer.test(ctx.params.id);
};
