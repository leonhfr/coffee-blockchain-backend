const model = require('../models/model');

exports.getAll = async ctx => {
  ctx.body = await model.getAll();
};

exports.createProducer = async ctx => {
  console.log(ctx.body);
  await model.createProducer(ctx.request.body);
  ctx.status = 201;
};

exports.createCoffe = async ctx => {
  await model.createCoffe(ctx.request.body);
  ctx.status = 201;
};

exports.test = async ctx => {
  ctx.body = await model.test(ctx.params.id);
};
