const md5 = require('md5');
const Coffee = require('../../../schemas/coffee');

async function upsertCoffee (state, payload, blockInfo, context) {
  try {
    const { owner, uuid, hash, price, quantity } = payload.data;
    //eslint-disable-next-line
    console.log(
      `Upsert coffee: owner: ${owner} | uuid: ${uuid} | hash: ${hash} | price: ${price} | quantity: ${quantity}`
    );
    const foundCoffee = await Coffee.find({
      where: { id: uuid }
    });
    const {
      name,
      botanical_variety,
      preparation,
      altitude,
      region,
      roast_appearance,
      details,
      price_kg,
      geo_location
    } = foundCoffee.dataValues;
    const bodyToCheck = JSON.stringify({
      name,
      botanical_variety,
      preparation,
      altitude,
      region,
      roast_appearance,
      details,
      price_kg,
      geo_location
    });
    if (hash === md5(bodyToCheck)) {
      Coffee.update(
        { confirmed: true },
        { returning: true, plain: true, where: { id: uuid } }
      );
      console.log('CONFIRMED');
    } else {
      console.log('NOT CONFIRMED: ', hash, md5(bodyToCheck));
    }
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = upsertCoffee;
