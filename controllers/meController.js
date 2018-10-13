const models = require('../models');

exports.getMe = async ctx => {
  let id = ctx.request.header.authorization.split(' ')[1];
  ctx.body = await models.me.getMe(id);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};

exports.updateMe = async ctx => {
  let id = ctx.request.header.authorization.split(' ')[1];
  ctx.body = await models.me.updateMe(id, ctx.request.body);
  if (ctx.body) return (ctx.status = 200);
  ctx.status = 404;
};
