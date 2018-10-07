const Router = require('koa-router');
const router = new Router();
const producerController = require('./controllers/producerController');

router.get('/', producerController.getAll);
router.post('/createProducer', producerController.createProducer);

module.exports = router;
