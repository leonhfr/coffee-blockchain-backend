const Transaction = require('../schemas/transaction');
const Customer = require('../schemas/customer');

exports.createTransaction = async transaction => {
  console.log(transaction);
  let res = await Transaction.create({
    id: transaction.id,
    quantity: transaction.quantity,
    price: transaction.price,
    customerId: transaction.customerId,
    shipperId: transaction.shipperId,
    coffeeId: transaction.coffeeId
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
