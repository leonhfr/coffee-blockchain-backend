const Customer = require('../schemas/customer');
const Transaction = require('../schemas/transaction');
const Picture = require('../schemas/picture');

exports.createCustomer = async customer => {
  console.log(customer);
  let newCustomer = await Customer.create({
    email: customer.email,
    id: customer.id,
    country: customer.country,
    description: customer.description,
    customer_name: customer.customer_name
  });
  return newCustomer;
};

exports.getCustomer = async id => {
  let customer = await Customer.find({
    include: [Transaction, Picture],
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
  let customers = await Customer.findAll({
    include: [Transaction, Picture]
  });
  return customers;
};
