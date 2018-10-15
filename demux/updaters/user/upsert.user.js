async function upsertUser (state, payload, blockInfo, context) {
  try {
    const { user, role, hash } = payload.data;
    //eslint-disable-next-line
    console.log(`Upsert user: user: ${user} | role: ${role} | hash: ${hash}`);
    // TODO: check information with database and update/insert user
    // and switch from pending to confirmed as appropriate
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = upsertUser;
