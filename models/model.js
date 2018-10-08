const Producer = require('../schemas/producer');
const Coffee = require('../schemas/coffee');

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

exports.createCoffee = async coffee => {
  Coffee.create({
    name: coffee.name,
    description: coffee.description,
    producerId: coffee.producerId
  });
};

exports.test = async id => {
  let res = await Producer.findAll({
    include: [{ model: Coffee }],
    where: { id: id }
  });
  return res;
};
