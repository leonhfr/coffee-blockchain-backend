const Producer = require('../schemas/producer');
const Coffee = require('../schemas/coffee');
const Customer = require('../schemas/customer');
const Transaction = require('../schemas/transaction');
const SQL = require('sql-template-strings');
const sequelize = require('../sequelize');

//  me  //

exports.getMe = async id => {
  let producer = await Producer.find({
    where: { id: id }
  });
  let customer = await Customer.find({
    where: { id: id }
  });
  /*   let shipper =  await Shipper.find({
    where: {id: id}
  }) */

  if (producer) return producer;
  if (customer) return customer;
  //if (shipper) return shipper;
};

exports.updateMe = async (id, info) => {
  let updateValue = {};
  if (
    await Producer.find({
      where: { id: id }
    })
  ) {
    if (info.producer_name) updateValue.producer_name = info.producer_name;
    if (info.country) updateValue.country = info.country;
    if (info.description) updateValue.description = info.description;
    await Producer.update(updateValue, {
      returning: true,
      plain: true,
      where: { id: id }
    });
    let producer = await Producer.find({
      where: { id: id }
    });
    return producer;
  }
  if (
    await Customer.find({
      where: { id: id }
    })
  ) {
    if (info.customer_name) updateValue.customer_name = info.customer_name;
    if (info.country) updateValue.country = info.country;
    if (info.description) updateValue.description = info.description;
    await Customer.update(updateValue, {
      returning: true,
      plain: true,
      where: { id: id }
    });
    let customer = await Customer.find({
      where: { id: id }
    });
    return customer;
  }
  /*   if (await Shipper.find({
    where: {id: id}
  })) {
  if (info.shipper_name) updateValue.shipper_name = info.shipper_name;
  if (info.country) updateValue.country = info.country;
  if (info.description) updateValue.description = info.description;
  await Shipper.update(updateValue, {
    returning: true,
    plain: true,
    where: { id: id }
  });
  shipper = await Shipper.find({
    where: { id: id }
  });
  return shipper;
} */
};

// customer  //

exports.createCustomer = async customer => {
  let newCustomer = await Customer.create({
    email: customer.email,
    id: customer.id
  });
  return newCustomer;
};

exports.getCustomer = async id => {
  let customer = await Customer.find({
    //include:[{Transaction, Picture}],  for later
    where: { id: id }
  });
  return customer;
};

exports.filterCustomers = async (filter, value) => {
  let whereCause = {};
  if (filter) {
    whereCause[filter] = value;
    let customers = await Customer.findAll({
      where: whereCause
    });
    return customers;
  }
};

exports.getCustomers = async () => {
  let customers = await Customer.findAll();
  return customers;
};

// producer //

exports.createProducer = async producer => {
  let newProducer = await Producer.create({
    email: producer.email,
    id: producer.id
  });
  return newProducer;
};

exports.getProducer = async id => {
  let producer = await Producer.find({
    include: [Coffee],
    where: { id: id }
  });
  return producer;
};

exports.filterProducers = async (filter, value) => {
  let whereCause = {};
  if (filter) {
    whereCause[filter] = value;
    let producers = await Producer.findAll({
      where: whereCause,
      include: [Coffee]
    });
    return producers;
  }
};

exports.getProducers = async () => {
  let producers = await Producer.findAll();
  return producers;
};

// coffee //

exports.createCoffee = async coffee => {
  let newCoffee = await Coffee.create({
    id: coffee.id,
    name: coffee.name,
    description: coffee.description,
    producerId: coffee.producerId
  });
  return newCoffee;
};

exports.getCoffee = async id => {
  let coffee = await Coffee.find({
    //include: [Transaction], for later;
    include: [Producer],
    where: { id: id }
  });
  return coffee;
};

exports.updateCoffee = async (id, info) => {
  let updateValue = {};
  if (info.name) updateValue.customer_name = info.customer_name;
  if (info.botanical_variety)
    updateValue.botanical_variety = info.botanical_variety;
  if (info.preparation) updateValue.preparation = info.preparation;
  if (info.altitude) updateValue.altitude = info.altitude;
  if (info.region) updateValue.region = info.region;
  if (info.roast_appearance)
    updateValue.roast_appearance = info.roast_appearance;
  if (info.bean_density) updateValue.bean_density = info.bean_density;
  if (info.details) updateValue.details = info.details;
  await Coffee.update(updateValue, {
    returning: true,
    plain: true,
    where: { id: id }
  });
  let coffee = await Coffee.find({
    where: { id: id }
  });
  return coffee;
};

exports.filterCoffees = async (filter, value) => {
  let whereCause = {};
  if (filter) {
    whereCause[filter] = value;
    let coffees = await Coffee.findAll({
      where: whereCause,
      include: [Producer]
    });
    return coffees;
  }
};

exports.getCoffees = async () => {
  let coffees = await Coffee.findAll();
  return coffees;
};

// transactions //

exports.createTransaction = async transaction => {
  let res = await Transaction.create({
    id: transaction.id,
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
