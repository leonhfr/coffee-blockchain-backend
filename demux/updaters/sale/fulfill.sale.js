async function fulfillSale (state, payload, blockInfo, context) {
  try {
    const { uuid } = payload.data;
    //eslint-disable-next-line
    console.log(`Fulfill sale: uuid: ${uuid}`);
    // TODO: confirmation that the sale has been taken into account by the blockchain
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = fulfillSale;
