const Router = require('koa-router');
const router = new Router();
const controller = require('./controllers/controller');

router.get('/', controller.getAll);
router.post('/createProducer', controller.createProducer);
router.post('/createCoffe', controller.createCoffe);
router.get('/test/:id', controller.test);

module.exports = router;
