const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const Picture = sequelize.define('Picture', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Picture;
