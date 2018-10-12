const Router = require('koa-router');
const router = new Router();
const controller = require('./controllers/controller');

router.post('/customers', controller.createCustomer);
router.get('/customers/:id', controller.getCustomer);
router.get('/customers/:filter/:value', controller.filterCustomers);
router.get('/customers', controller.getCustomers);

router.post('/producers', controller.createProducer);
router.get('/producers/:id', controller.getProducer);
router.get('/producers/:filter/:value', controller.filterProducers);
router.get('/producers', controller.getProducers);

router.post('/coffees/:producerId', controller.createCoffee);
router.get('/coffees/:coffeeId', controller.getCoffee);
router.put('/coffees/', controller.updateCoffee);
router.get('/coffees/:filter/:value', controller.filterCoffees);
router.get('/coffees', controller.getCoffees);

router.get('/me', controller.getMe);
router.put('/me', controller.updateMe);

router.post('/transactions/', controller.createTransaction);
router.get('/transactions/:id', controller.getTransaction);

router.post('/shippers', controller.createShipper);
router.get('/shippers', controller.getShippers);

module.exports = router;
