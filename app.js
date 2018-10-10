if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const logger = require('koa-logger');
const router = require('./router');

const app = new Koa();

app.use(logger());
app.use(cors());
app.use(bodyParser());
app.use(router.routes());

const port = process.env.PORT || 3000;
// eslint-disable-next-line
app.listen(port, () => console.log('server running on: ', port));
