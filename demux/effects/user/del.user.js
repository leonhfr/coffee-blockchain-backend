async function delUser (state, payload, blockInfo, context) {
  try {
    // do stuff acting on external services
    //eslint-disable-next-line
    console.log('effect: delete user', payload.data, blockInfo);
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = delUser;
