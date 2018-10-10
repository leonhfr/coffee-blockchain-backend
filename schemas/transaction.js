const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  quantity: Sequelize.DECIMAL,
  price: Sequelize.DECIMAL
});

module.exports = Transaction;
