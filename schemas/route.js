const sequelize = require('../models/sequelize');
const Sequelize = require('sequelize');

const Route = sequelize.define('Route', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  origin: {
    type: Sequelize.GEOMETRY('POINT')
  },
  destination: {
    type: Sequelize.GEOMETRY('POINT')
  },
  price: {
    type: Sequelize.DECIMAL
  }
});

module.exports = Route;
