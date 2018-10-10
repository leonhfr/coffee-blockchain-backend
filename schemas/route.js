const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Route = sequelize.define('Route', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  origin: {
    type: Sequelize.GEOMETRY('point')
  },
  destination: {
    type: Sequelize.GEOMETRY('point')
  },
  price: {
    type: Sequelize.DECIMAL
  }
});

module.exports = Route;
