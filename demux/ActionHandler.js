const { AbstractActionHandler } = require('demux');
const redis = require('../models/redis');
const key = `${process.env.REDIS_PREFIX_EOSIO}-index-state`;

class ActionHandler extends AbstractActionHandler {

  constructor (updaters, effects) {
    super(updaters, effects);
  }

  async handleWithState (handle) {
    try {
      const state = {};
      const context = {};
      await handle(state, context);
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
    }
  }

  async updateIndexState (state, block, isReplay) {
    const { blockHash, blockNumber } = block.blockInfo;
    try {
      await redis.hmset(key, {
        blockNumber,
        blockHash,
        isReplay
      });
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
    }
  }

  async loadIndexState () {
    try {
      const indexState = await redis.hgetall(key);
      // would need to return redis index state in production
      return { blockNumber: 0, blockHash: '' };
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
    }
  }
}

module.exports = ActionHandler;
