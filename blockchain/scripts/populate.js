require('dotenv').config();
const Sequelize = require('sequelize');
const models = require('../../models');
const users = require('./mock.data.user.json');
const coffees = require('./mock.data.coffee.json');
const pictures = require('./mock.data.pictures.json');
const transactionsOrdered = require('./mock.data.transaction.ordered');
const transactionsShipped = require('./mock.data.transaction.shipped');
const transactionsDelivered = require('./mock.data.transaction.delivered');

async function processArray (array, handle, type) {
  const promises = array.map(handle);
  await Promise.all(promises);
  //eslint-disable-next-line
  console.log(`Inserted ${type} mock data!`);
}

async function populate () {
  await processArray(
    users.filter(el => el.role === 'consumer'),
    models.customer.createCustomer,
    'users'
  );
  await processArray(
    users.filter(el => el.role === 'producer'),
    models.producer.createProducer,
    'producers'
  );
  await processArray(pictures, models.picture.createPicture, 'picture');
  await processArray(coffees, models.coffee.createCoffee, 'coffees');
  await processArray(
    transactionsOrdered,
    models.transaction.createTransaction,
    'transaction (ordered)'
  );
  await processArray(
    transactionsShipped,
    models.transaction.createTransaction,
    'transaction (shipped)'
  );
  await processArray(
    transactionsDelivered,
    models.transaction.createTransaction,
    'transaction (delivered)'
  );
  //eslint-disable-next-line
  console.log('Database populated with mock data!');
}

async function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

sequelize
  .sync()
  .then(() => {
    console.log('Sequelize connected to MySQL.'); //eslint-disable-line
  })
  .then(async () => {
    console.log('Sleep for 1s to allow time to create tables.'); //eslint-disable-line
    await sleep(1000);
  })
  .then(async () => {
    await populate();
  })
  .then(() => {
    process.exit();
  })
  .catch(e => console.error(e)); //eslint-disable-line
