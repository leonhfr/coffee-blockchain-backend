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

const Coffe = db.define('coffe', {
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

exports.createCoffe = async coffe => {
  Coffe.create({
    name: coffe.name,
    description: coffe.description,
    producerId: coffe.producerId
  });
};

// testing
Producer.hasMany(Coffe, {
  foreignKey: 'producerId',
  sourceKey: 'id'
});

Coffe.belongsTo(Producer, {
  foreignKey: 'producerId',
  targetKey: 'id'
});

exports.test = async id => {
  let res = await Producer.findAll({
    include: [{ model: Coffe }],
    where: { id: id }
  });
  return res;
};
