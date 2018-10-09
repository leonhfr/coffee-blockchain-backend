const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

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
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  producerId: {
    type: Sequelize.UUID,
    defaultValue: null
  }
});

module.exports = Coffee;
