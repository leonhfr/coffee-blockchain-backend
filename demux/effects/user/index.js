const upsertUser = require('./upsert.user');
const delUser    = require('./del.user');

const account = process.env.EOSIO_CONTRACT_ACCOUNT;

module.exports = [
  {
    actionType: `${account}::upsertuser`,
    effect: upsertUser
  },
  {
    actionType: `${account}::deluser`,
    effect: delUser
  }
];
