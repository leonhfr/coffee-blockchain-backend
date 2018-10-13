const models = require('../../models');
const users = require('./mock.data.user.json');
const coffees = require('./mock.data.coffee.json');

async function processArray (array, handle, type) {
  const promises = array.map(handle);
  await Promise.all(promises);
  //eslint-disable-next-line
  console.log(`Inserted ${type} mock data!`);
}

async function process () {
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
  await processArray(coffees, coffeeModel.createCoffee, 'coffees');
  //eslint-disable-next-line
  console.log('Database populated with mock data!');
}

module.exports = () => process();
