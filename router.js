const Router = require('koa-router');
const router = new Router();

const me = require('./controllers/meController');
const customer = require('./controllers/customerController');
const producer = require('./controllers/producerController');
const coffee = require('./controllers/coffeeController');
const transaction = require('./controllers/transactionController');
const shipper = require('./controllers/shipperController');
const stripe = require('./controllers/stripeController');

router.post('/customers', customer.createCustomer);
router.get('/customers/:id', customer.getCustomer);
router.get('/customers/:filter/:value', customer.filterCustomers);
router.get('/customers', customer.getCustomers);

router.post('/producers', producer.createProducer);
router.get('/producers/:id', producer.getProducer);
router.get('/producers/:filter/:value', producer.filterProducers);
router.get('/producers', producer.getProducers);

router.post('/coffees', coffee.createCoffee);
router.get('/coffees/:coffeeId', coffee.getCoffee);
router.put('/coffees/', coffee.updateCoffee);
router.get('/coffees/:filter/:value', coffee.filterCoffees);
router.get('/coffees', coffee.getCoffees);

router.get('/me', me.getMe);
router.put('/me', me.updateMe);

router.post('/transactions/', transaction.createTransaction);
router.get('/transactions', transaction.getTransactions);
router.put('/transactions/:id', transaction.updateTransaction);
router.get('/transactions/transaction/:id', transaction.getSpecificTransaction);

router.post('/shippers', shipper.createShipper);
router.get('/shippers', shipper.getShippers);

router.post('/charge', stripe.charge);

module.exports = router;
