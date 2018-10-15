const initiateSale = require('./initiate.sale');
const shipSale  = require('./ship.sale');
const fulfillSale  = require('./fulfill.sale');

const account = process.env.EOSIO_CONTRACT_ACCOUNT;

module.exports = [
  {
    actionType: `${account}::initiatesale`,
    updater: initiateSale
  },
  {
    actionType: `${account}::shipsale`,
    updater: shipSale
  },
  {
    actionType: `${account}::fulfillsale`,
    updater: fulfillSale
  }
];
