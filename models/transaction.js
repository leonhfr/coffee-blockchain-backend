const Transaction = require('../schemas/transaction');
const Customer = require('../schemas/customer');

exports.createTransaction = async transaction => {
  const res = await Transaction.create({
    id: transaction.id,
    quantity: transaction.quantity,
    price: transaction.price,
    customerId: transaction.customerId,
    shipperId: transaction.shipperId,
    coffeeId: transaction.coffeeId,
    total: transaction.total,
    status_code: transaction.status_code
  });
  return res;
};

exports.getCustomerAndTransactions = async id => {
  const res = await Customer.findAll({
    include: [{ model: Transaction }],
    where: { id: id }
  });
  return res;
};

exports.getAllTransactions = async () => {
  const res = await Transaction.findAll();
  return res;
};

exports.updateTransaction = async (info, id) => {
  let updateValue = {};
  if (info.quantity) updateValue.quantity = info.quantity;
  if (info.price) updateValue.price = info.price;
  if (info.total) updateValue.total = info.total;
  if (info.status_code) updateValue.status_code = info.status_code;
  await Transaction.update(updateValue, {
    returning: true,
    plain: true,
    where: { id: id }
  });
  const updatedTransaction = await Transaction.find({
    where: { id: id }
  });
  return updatedTransaction;
};
