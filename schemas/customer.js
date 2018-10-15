const sequelize = require('../models/sequelize');
const Sequelize = require('sequelize');

const Transaction = require('./transaction');
const Picture = require('./picture');

const Customer = sequelize.define('customer', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  customer_name: {
    type: Sequelize.STRING
  },
  country: {
    type: Sequelize.STRING
  },
  geo_location: {
    type: Sequelize.GEOMETRY('POINT'),
    allowNull: true
  },
  description: Sequelize.TEXT,
  email: Sequelize.STRING,
  confirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
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

Picture.belongsTo(Customer, {
  foreignKey: 'customerId'
});

module.exports = Customer;
