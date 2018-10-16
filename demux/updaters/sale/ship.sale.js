async function shipSale (state, payload, blockInfo, context) {
  try {
    const { uuid, seller } = payload.data;
    //eslint-disable-next-line
    console.log(`Ship sale: uuid: ${uuid} | buyer: ${seller}`);
    // TODO: check information with database and initiate sale
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = shipSale;
