require('dotenv').config();
const Sequelize = require('sequelize');
const model = require('../../models/model');
const users = require('./mock.data.user.json');
const coffees = require('./mock.data.coffee.json');

async function processArray (array, handle, type) {
  const promises = array.map(handle);
  await Promise.all(promises);
  //eslint-disable-next-line
  console.log(`Inserted ${type} mock data!`);
}

async function populate () {
  await processArray(users.filter(el => el.role === 'consumer'), model.createCustomer, 'users');
  await processArray(users.filter(el => el.role === 'producer'), model.createProducer, 'producers');
  await processArray(coffees, model.createCoffee, 'coffees');
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
    console.log('Sleep for 2s to allow time to create tables.'); //eslint-disable-line
    await sleep(2000);
  })
  .then(async () => {
    await populate();
  })
  .then(() => {
    process.exit();
  })
  .catch(e => console.error(e)); //eslint-disable-line
