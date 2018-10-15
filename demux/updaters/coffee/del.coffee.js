async function delCoffee (state, payload, blockInfo, context) {
  try {
    const { owner, uuid, hash, price, quantity } = payload.data;
    //eslint-disable-next-line
    console.log(`Delete coffee: owner: ${owner} | uuid: ${uuid} | hash: ${hash} | price: ${price} | quantity: ${quantity}`);
    // TODO: check information with database and delete coffee
    // and switch from pending to confirmed as appropriate
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = delCoffee;
