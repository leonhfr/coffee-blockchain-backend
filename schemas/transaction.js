const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  quantity: Sequelize.DECIMAL,
  price: Sequelize.DECIMAL
});

module.exports = Transaction;
