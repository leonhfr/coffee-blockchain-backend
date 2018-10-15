const sequelize = require('../models/sequelize');
const Sequelize = require('sequelize');

const Shipper = require('./shipper');

const Transaction = sequelize.define('transaction', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  quantity: Sequelize.DECIMAL,
  price: Sequelize.DECIMAL,
  confirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

sequelize.models.shipper.hasMany(Transaction, { foreignKey: 'shipperId' });
Transaction.belongsTo(Shipper, { foreignKey: 'shipperId' });

module.exports = Transaction;
