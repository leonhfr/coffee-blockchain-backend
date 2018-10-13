const Customer = require('../schemas/customer');
const Transaction = require('../schemas/transaction');

exports.createCustomer = async customer => {
  let newCustomer = await Customer.create({
    email: customer.email,
    id: customer.id
  });
  return newCustomer;
};

exports.getCustomer = async id => {
  let customer = await Customer.find({
    include: [Transaction],
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
    include: [Transaction]
  });
  return customers;
};
