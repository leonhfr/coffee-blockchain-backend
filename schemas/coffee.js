const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const Producer = require('./producer');

const Coffee = sequelize.define('coffee', {
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
  }
});

Coffee.belongsTo(Producer, {
  foreignKey: 'producerId',
  targetKey: 'id'
});

module.exports = Coffee;