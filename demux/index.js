const { BaseActionWatcher } = require('demux');
const { NodeosActionReader } = require('demux-eos');

const ActionHandler = require('./ActionHandler');
const updaters = require('./updaters');
const effects  = require('./effects');

const actionReader = new NodeosActionReader(
  process.env.EOSIO_HTTP_URL,
  parseInt(process.env.EOSIO_STARTING_BLOCK, 10)
);
const actionHandler = new ActionHandler(updaters, effects);

const actionWatcher = new BaseActionWatcher(
  actionReader,
  actionHandler,
  250 // polling at twice the block interval for less latency
);

module.exports = actionWatcher;
