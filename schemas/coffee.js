const Sequelize = require('sequelize');
const sequelize = require('../models/sequelize');
const Transaction = require('./transaction');
const Producer = require('./producer');

const Coffee = sequelize.define('Coffee', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    defaultValue: null
  },
  botanical_variety: {
    type: Sequelize.TEXT,
    defaultValue: null
  },
  preparation: {
    type: Sequelize.ENUM('wet', 'dry'),
    defaultValue: null
  },
  altitude: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  region: {
    type: Sequelize.STRING,
    defaultValue: null
  },
  roast_appearance: {
    type: Sequelize.TEXT,
    defaultValue: null
  },
  details: {
    type: Sequelize.TEXT,
    defaultValue: null
  },
  price_kg: {
    type: Sequelize.DECIMAL,
    defaultValue: 0
  },
  geo_location: {
    type: Sequelize.GEOMETRY('POINT'),
    allowNull: true
  }
});

Coffee.hasMany(Transaction, {
  foreignKey: 'coffeeId',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

sequelize.models.Transaction.belongsTo(Coffee, { foreignKey: 'coffeeId' });

module.exports = Coffee;
