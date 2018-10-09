const Producer = require('../schemas/producer');
const Coffee = require('../schemas/coffee');
const Customer = require('../schemas/customer');
const Transaction = require('../schemas/transaction');

// customer  //

exports.createCustomer = async customer => {
  let newCustomer = await Customer.create({
    email: customer.email
  });
  return newCustomer;
};

exports.getCustomer = async id => {
  let customer = await Customer.findAll({
    //include:[{Transaction, Picture}],  for later
    where: { id: id }
  });
  return customer;
};

exports.updateCustomer = async (id, info) => {
  let customer = await Customer.findAll({
    where: { id: id }
  });
  let updateValue = {};
  if (info.customer_name) updateValue.customer_name = info.customer_name;
  if (info.country) updateValue.country = info.country;
  if (info.description) updateValue.description = info.description;

  let updated = await customer.update(updateValue);
  return updated;
};

// producer //

exports.createProducer = async producer => {
  let newProducer = await Producer.create({
    email: producer.email
  });
  return newProducer;
};

exports.getProducer = async id => {
  let producer = await Producer.findAll({
    include: [Coffee],
    where: { id: id }
  });
  return producer;
};

exports.updateProducer = async (id, info) => {
  let producer = await Producer.findAll({
    where: { id: id }
  });
  let updateValue = {};
  if (info.business_name) updateValue.business_name = info.business_name;
  if (info.country) updateValue.country = info.country;
  if (info.description) updateValue.description = info.description;
  let updated = await producer.update(updateValue);
  return updated;
};

// coffee //

exports.createCoffee = async coffee => {
  let newCoffee = await Coffee.create({
    name: coffee.name,
    description: coffee.description,
    producerId: coffee.producerId
  });
  return newCoffee;
};

exports.getCoffee = async id => {
  let coffee = await Coffee.findAll({
    //include: [Transaction], for later;
    where: { id: id }
  });
  return coffee;
};

exports.updateCoffee = async (id, info) => {
  // let producer = await Producer.findAll({
  //   where: { id: id }
  // });
  // let updateValue = {};
  // if (info.business_name) updateValue.business_name = info.business_name;
  // if (info.country) updateValue.country = info.country;
  // if (info.description) updateValue.description = info.description;
  // let updated = await producer.update(updateValue);
  // return updated;
};

// transactions //

exports.createTransaction = async transaction => {
  let res = await Transaction.create({
    quantity: transaction.quantity,
    price: transaction.price,
    customerId: transaction.customerId
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

// extra  //

exports.test = async id => {
  let res = await Producer.findAll({
    include: [{ model: Coffee }],
    where: { id: id }
  });
  return res;
};

exports.getAll = async () => {
  return await Producer.findAll();
};
