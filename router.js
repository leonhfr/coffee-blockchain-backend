const Router = require('koa-router');
const router = new Router();
const controller = require('./controllers/controller');

/* router.get('/', controller.getAll);
router.post('/createProducer', controller.createProducer);
router.post('/createCoffee', controller.createCoffee);
router.get('/test/:id', controller.test);

router.post('/createCustomer', controller.createCustomer);
router.post('/Transaction', controller.createTransaction);
router.get('/Transaction/:id', controller.getTransaction); */
/////////////////////////////////////////////////////////
//         REFACTORING ROUTES                          //
/////////////////////////////////////////////////////////
router.post('/customer', controller.createCustomer);
router.get('/customer/:id', controller.getCustomer);
router.put('/customer', controller.updateCustomer);

router.post('/producer', controller.createProducer);
router.get('/producer/:id', controller.getProducer);
router.put('/');

//router.post('/shipper', controller.createShipper);//todo
//router.get('/shipper/:id', controller.getShipper);//todo

router.post('/coffee/:producerId', controller.createCoffee);
router.get('/coffee/:coffeeId', controller.getCoffee);
router.put('/');

module.exports = router;
