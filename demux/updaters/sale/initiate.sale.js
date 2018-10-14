async function initiateSale (state, payload, blockInfo, context) {
  try {
    const { uuid, uuid_coffee, buyer, quantity } = payload.data;
    //eslint-disable-next-line
    console.log(`Initiate sale: uuid: ${uuid} | uuid_coffee: ${uuid_coffee} | buyer: ${buyer} | quantity: ${quantity}`);
    // TODO: check information with database and initiate sale
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = initiateSale;
