async function initiateSale (state, payload, blockInfo, context) {
  try {
    // do stuff like update database
    //eslint-disable-next-line
    console.log('updater: initiate sale', payload.data, blockInfo);
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = initiateSale;
