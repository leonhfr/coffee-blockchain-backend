const db = require('../db');
const Sequelize = require('sequelize');

const Producer = db.define('producer', {
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
  offer: Sequelize.ENUM('id'),
  description: Sequelize.TEXT,
  pictures: Sequelize.STRING,
  transactions: Sequelize.ENUM('id')
});

exports.getAll = async () => {
  return await Producer.findAll();
};

exports.createProducer = producer => {
  Producer.create({
    business_name: producer.business_name,
    country: producer.country,
    description: producer.description
  });
};
