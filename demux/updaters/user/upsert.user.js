async function upsertUser (state, payload, blockInfo, context) {
  try {
    // do stuff like update database
    //eslint-disable-next-line
    console.log('updater: upsert user', payload.data, blockInfo);
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = upsertUser;
