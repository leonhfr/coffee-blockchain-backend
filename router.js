const Router = require('koa-router');
const router = new Router();
const producerController = require('./controllers/producerController');

router.get('/', producerController.getAll);
router.post('/createProducer', producerController.createProducer);
router.post('/createCoffe', producerController.createCoffe);
router.get('/test/:id', producerController.test);

module.exports = router;
