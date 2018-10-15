const upsertCoffee = require('./upsert.coffee');
const delCoffee    = require('./del.coffee');

const account = process.env.EOSIO_CONTRACT_ACCOUNT;

module.exports = [
  {
    actionType: `${account}::upsertcoffee`,
    updater: upsertCoffee
  },
  {
    actionType: `${account}::delcoffee`,
    updater: delCoffee
  }
];
