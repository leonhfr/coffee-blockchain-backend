const Customer = require('../schemas/customer');
const Transaction = require('../schemas/transaction');
const Picture = require('../schemas/picture');

exports.createCustomer = async customer => {
  const newCustomer = await Customer.create({
    email: customer.email,
    id: customer.id,
    country: customer.country,
    description: customer.description,
    customer_name: customer.customer_name,
    picture_hash: customer.picture_hash
  });
  return newCustomer;
};

exports.getCustomer = async id => {
  const customer = await Customer.find({
    include: [Transaction, Picture],
    where: { id: id }
  });
  return customer;
};

exports.filterCustomers = async (filter, value) => {
  let whereCause = {};
  if (filter) {
    whereCause[filter] = value;
    const customers = await Customer.findAll({
      where: whereCause
    });
    return customers;
  }
};

exports.getCustomers = async () => {
  const customers = await Customer.findAll({
    include: [Transaction, Picture]
  });
  return customers;
};
