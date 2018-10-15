const sequelize = require('../models/sequelize');
const Sequelize = require('sequelize');
const Picture = require('./picture');
const Route = require('./route');

const Shipper = sequelize.define('Shipper', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  shipper_name: {
    type: Sequelize.STRING
  },
  country: {
    type: Sequelize.STRING
  },
  description: Sequelize.TEXT
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
