const model = require('../../models/model');
const users = require('./mock.data.user.json');
const coffees = require('./mock.data.coffee.json');

async function processArray (array, handle, type) {
  const promises = array.map(handle);
  await Promise.all(promises);
  //eslint-disable-next-line
  console.log(`Inserted ${type} mock data!`);
}

async function process () {
  await processArray(users.filter(el => el.role === 'consumer'), model.createCustomer, 'users');
  await processArray(users.filter(el => el.role === 'producer'), model.createProducer, 'producers');
  await processArray(coffees, model.createCoffee, 'coffees');
  //eslint-disable-next-line
  console.log('Database populated with mock data!');
}

module.exports = () => process();
