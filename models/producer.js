const Producer = require('../schemas/producer');
const Coffee = require('../schemas/coffee');

exports.createProducer = async producer => {
  let newProducer = await Producer.create({
    email: producer.email,
    id: producer.id,
    business_name: producer.business_name,
    country: producer.country,
    description: producer.description
  });
  return newProducer;
};

exports.getProducer = async id => {
  let producer = await Producer.find({
    include: [Coffee],
    where: { id: id }
  });
  return producer;
};

exports.filterProducers = async (filter, value) => {
  let whereCause = {};
  if (filter) {
    whereCause[filter] = value;
    let producers = await Producer.findAll({
      where: whereCause,
      include: [Coffee]
    });
    return producers;
  }
};

exports.getProducers = async () => {
  let producers = await Producer.findAll({
    include: [Coffee]
  });
  return producers;
};
