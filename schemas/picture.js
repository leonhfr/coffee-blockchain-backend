const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Picture = sequelize.define('Picture', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Picture;
