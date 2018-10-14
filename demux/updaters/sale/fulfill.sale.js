async function fulfillSale (state, payload, blockInfo, context) {
  try {
    // do stuff like update database
    //eslint-disable-next-line
    console.log('updater: fulfill sale', payload.data, blockInfo);
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = fulfillSale;
