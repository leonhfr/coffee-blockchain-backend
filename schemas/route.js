const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Route = sequelize.define('Route', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  origin: {
    type: Sequelize.GEOMETRY('point'),
    allowNull: false
  },
  destination: {
    type: Sequelize.GEOMETRY('point'),
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false
  }
});

module.exports = Route;
