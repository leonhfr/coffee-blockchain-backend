const Producer = require('../schemas/producer');
const Coffee = require('../schemas/coffee');
const Customer = require('../schemas/customer');
const Transaction = require('../schemas/transaction');

exports.getAll = async () => {
  return await Producer.findAll();
};

exports.createProducer = producer => {
  Producer.create({
    business_name: producer.business_name,
    country: producer.country,
    description: producer.description
  });
};

exports.createCoffee = async coffee => {
  Coffee.create({
    name: coffee.name,
    description: coffee.description,
    producerId: coffee.producerId
  });
};

exports.createCustomer = async customer => {
  let res = await Customer.create({
    customer_name: customer.name,
    country: customer.country,
    description: customer.description
  });
  return res;
};

exports.createTransaction = async transaction => {
  console.log('transaction incoming: ', transaction);
  let res = await Transaction.create({
    quantity: transaction.quantity,
    price: transaction.price,
    customerId: transaction.customerId
  });
  return res;
};

exports.test = async id => {
  let res = await Producer.findAll({
    include: [{ model: Coffee }],
    where: { id: id }
  });
  return res;
};

exports.getCustomerAndTransactions = async id => {
  let res = await Customer.findAll({
    include: [{ model: Transaction }],
    where: { id: id }
  });
  return res;
};
