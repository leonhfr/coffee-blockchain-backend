const Router = require('koa-router');
const router = new Router();
const controller = require('./controllers/controller');

router.get('/', controller.getAll);
router.post('/createProducer', controller.createProducer);
router.post('/createCoffee', controller.createCoffee);
router.get('/test/:id', controller.test);

router.post('/createCustomer', controller.createCustomer);
router.post('/Transaction', controller.createTransaction);
router.get('/Transaction/:id', controller.getTransaction);

module.exports = router;
