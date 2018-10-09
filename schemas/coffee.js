const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const Transaction = require('./transaction');

const Coffee = sequelize.define('Coffee', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
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
    defaultValue: null
  },
  region: {
    type: Sequelize.STRING,
    defaultValue: null
  },
  roast_appearance: {
    type: Sequelize.TEXT,
    defaultValue: null
  },
  bean_density: {
    type: Sequelize.FLOAT,
    defaultValue: null
  },
  details: {
    type: Sequelize.TEXT,
    defaultValue: null
  }
});

Coffee.hasMany(Transaction, {
  foreignKey: 'coffeenameId',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

module.exports = Coffee;
