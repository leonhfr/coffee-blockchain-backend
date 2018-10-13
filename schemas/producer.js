const sequelize = require('../models/sequelize');
const Sequelize = require('sequelize');
const Coffee = require('./coffee');

const Producer = sequelize.define('Producer', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  business_name: {
    type: Sequelize.STRING
  },
  country: {
    type: Sequelize.STRING
  },
  email: Sequelize.STRING,
  description: Sequelize.TEXT
});

sequelize.models.Coffee.belongsTo(Producer, { foreignKey: 'producerId' });

Producer.hasMany(Coffee, {
  foreignKey: 'producerId',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

module.exports = Producer;
