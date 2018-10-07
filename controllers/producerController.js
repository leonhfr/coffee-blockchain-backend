const producer = require('../models/producerModel');

exports.getAll = async ctx => {
  ctx.body = await producer.getAll();
};

exports.createProducer = async ctx => {
  console.log(ctx.body);
  await producer.createProducer(ctx.request.body);
  ctx.status = 201;
};
