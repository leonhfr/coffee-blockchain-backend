const Transaction = require('../schemas/transaction');
const Producer = require('../schemas/producer');
const Coffee = require('../schemas/coffee');

exports.createCoffee = async coffee => {
  const newCoffee = await Coffee.create({
    id: coffee.id,
    name: coffee.name,
    botanical_variety: coffee.botanical_variety || '',
    preparation: coffee.preparation || '',
    altitude: coffee.altitude || 0,
    region: coffee.region || '',
    roast_appearance: coffee.roast_appearance || '',
    details: coffee.details || '',
    producerId: coffee.producerId,
    geo_location: coffee.geo_location,
    price_kg: coffee.price_kg || 5,
    available: coffee.available,
    picture_hash: coffee.picture_hash
  });
  return newCoffee;
};

exports.getCoffee = async id => {
  const coffee = await Coffee.find({
    include: [Producer, Transaction],
    where: { id: id }
  });
  return coffee;
};

exports.updateCoffee = async (id, info) => {
  let updateValue = {};
  if (info.name) updateValue.customer_name = info.customer_name;
  if (info.botanical_variety)
    updateValue.botanical_variety = info.botanical_variety;
  if (info.preparation) updateValue.preparation = info.preparation;
  if (info.altitude) updateValue.altitude = info.altitude;
  if (info.region) updateValue.region = info.region;
  if (info.roast_appearance)
    updateValue.roast_appearance = info.roast_appearance;
  if (info.bean_density) updateValue.bean_density = info.bean_density;
  if (info.details) updateValue.details = info.details;
  if (info.geo_location) updateValue.geo_location = info.geo_location;
  if (info.available) updateValue.available = info.available;
  if (info.picture_hash) updateValue.picture_hash = info.picture_hash;
  await Coffee.update(updateValue, {
    returning: true,
    plain: true,
    where: { id: id }
  });
  const coffee = await Coffee.find({
    where: { id: id }
  });
  return coffee;
};

exports.filterCoffees = async (filter, value) => {
  let whereCause = {};
  if (filter) {
    whereCause[filter] = value;
    const coffees = await Coffee.findAll({
      where: whereCause,
      include: [Producer]
    });
    return coffees;
  }
};

exports.getCoffees = async () => {
  const coffees = await Coffee.findAll({
    include: [Producer, Transaction]
  });
  return coffees;
};
