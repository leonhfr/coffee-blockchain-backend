const sequelize = require('../sequelize');
const Sequelize = require('sequelize');
const Coffee = require('./coffee');

const Producer = sequelize.define('Producer', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  business_name: {
    type: Sequelize.STRING
  },
  country: {
    type: Sequelize.STRING
  },
  description: Sequelize.TEXT,
  pictures: Sequelize.STRING,
  transactions: Sequelize.ENUM('id')
});

// testing

Producer.hasMany(Coffee, {
  foreignKey: 'producerId',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

module.exports = Producer;
