if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const Koa          = require('koa');
const bodyParser   = require('koa-bodyparser');
const cors         = require('koa-cors');
const logger       = require('koa-logger');
const router       = require('./router');
const demux        = require('./demux');
const sequelize    = require('./sequelize');
const errorHandler = require('./middlewares/error-handler');

const app = new Koa();

app.use(logger())
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(errorHandler);

const port = process.env.PORT || 3000;
// eslint-disable-next-line
app.listen(port, () => console.log('server running on: ', port));

demux.watch();
