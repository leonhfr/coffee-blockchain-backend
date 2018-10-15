const Producer = require('../schemas/producer');
const Coffee = require('../schemas/coffee');
const Transaction = require('../schemas/transaction');

exports.createProducer = async producer => {
  const newProducer = await Producer.create({
    email: producer.email,
    id: producer.id,
    business_name: producer.business_name,
    country: producer.country,
    description: producer.description
  });
  return newProducer;
};

exports.getProducer = async id => {
  const producer = await Producer.find({
    include: [{ model: Coffee, include: [Transaction] }],
    where: { id: id }
  });
  return producer;
};

exports.filterProducers = async (filter, value) => {
  let whereCause = {};
  if (filter) {
    whereCause[filter] = value;
    const producers = await Producer.findAll({
      where: whereCause,
      include: [{ model: Coffee, include: [Transaction] }]
    });
    return producers;
  }
};

exports.getProducers = async () => {
  const producers = await Producer.findAll({
    include: [{ model: Coffee, include: [Transaction] }]
  });
  return producers;
};
