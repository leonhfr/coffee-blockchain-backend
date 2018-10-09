const Router = require('koa-router');
const router = new Router();
const controller = require('./controllers/controller');

router.post('/customer', controller.createCustomer);
router.get('/customer/:id', controller.getCustomer);
router.put('/customer', controller.updateCustomer);

router.post('/producer', controller.createProducer);
router.get('/producer/:id', controller.getProducer);
router.put('/producer/', controller.updateProducer);

router.post('/coffee/:producerId', controller.createCoffee);
router.get('/coffee/:coffeeId', controller.getCoffee);
router.put('/coffee/:coffeeId', controller.updateCoffee);

module.exports = router;
