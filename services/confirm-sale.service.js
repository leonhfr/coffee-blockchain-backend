const eosjs = require('eosjs');

const config = {
  chainId: null,
  keyProvider: [process.env.EOSIO_CONTRACT_PRIVATE_KEY],
  httpEndpoint: `http://${process.env.EOSIO_NETWORK_HOST}:${process.env.EOSIO_NETWORK_PORT}`,
  expireInSeconds: 60,
  broadcast: true,
  verbose: false,
  sign: true
};

// send 'fulfillsale' action to blockchain after Stripe payment is confirmed

eos = eosjs(config);

export default async (uuid) => {
  try {
    return await eos.transaction({
      actions: [
        {
          account: process.env.EOSIO_CONTRACT_ACCOUNT,
          name: 'fulfillsale',
          authorization: [
            {
              actor: process.env.EOSIO_CONTRACT_ACCOUNT,
              permission: 'active'
            }
          ],
          data: {
            uuid
          }
        }
      ]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
  } catch (e) {
    //eslint-disable-next-line
    console.log('Caught exception: ' + e);
  }
};
