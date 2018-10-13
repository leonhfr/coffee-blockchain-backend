const sequelize = require('../models/sequelize');
const Sequelize = require('sequelize');

const Shipper = require('./shipper');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  quantity: Sequelize.DECIMAL,
  price: Sequelize.DECIMAL
});

sequelize.models.Shipper.hasMany(Transaction, { foreignKey: 'shipperId' });
Transaction.belongsTo(Shipper, { foreignKey: 'shipperId' });

module.exports = Transaction;
