const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Transaction = require('./transaction');

const Customer = sequelize.define('Customer', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  customer_name: {
    type: Sequelize.STRING
  },
  country: {
    type: Sequelize.STRING
  },
  description: Sequelize.TEXT
});

Customer.hasMany(Transaction, {
  foreignKey: 'customerId',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

Customer.hasMany(Picture, {
  foreignKey: 'customerId',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

module.exports = Customer;
