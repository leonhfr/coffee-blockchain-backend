const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Transaction = require('./transaction');

const Shipper = sequelize.define('Shipper', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  shipper_name: {
    type: Sequelize.STRING
  },
  country: {
    type: Sequelize.STRING
  },
  description: Sequelize.TEXT
});

Shipper.hasMany(Transaction, {
  foreignKey: 'shipperId',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

Shipper.hasMany(Picture, {
  foreignKey: 'shipperId',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

Shipper.hasMany(Route, {
  foreignKey: 'shipperId',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

module.exports = Shipper;
