const models = require('../models');

exports.createShipper = async ctx => {
  ctx.body = await models.shipper.createShipper(ctx.request.body);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.getShippers = async ctx => {
  ctx.body = await models.shipper.getShippers();
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};
