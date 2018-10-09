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
    allowNull: false
  },
  botanical_variety: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  preparation: {
    type: Sequelize.ENUM('wet', 'dry'),
    allowNull: false
  },
  altitude: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  region: {
    type: Sequelize.STRING,
    allowNull: false
  },
  roast_appearance: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  bean_density: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  details: {
    type: Sequelize.TEXT
  }
});

Coffee.hasMany(Transaction, {
  foreignKey: 'coffeId',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

module.exports = Coffee;
