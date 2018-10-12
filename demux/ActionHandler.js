const { AbstractActionHandler } = require('demux');

// TODO: BlockIndexState?

class ActionHandler extends AbstractActionHandler {

  constructor (updaters, effects) {
    super(updaters, effects);
  }

  async handleWithState (handle) {
    // eslint-disable-next-line
    console.log('handleWithState');
    // TODO: handleWithState
  }

  async updateIndexState (state, block, isReplay) {
    // eslint-disable-next-line
    console.log('updateIndexState', state, block, isReplay);
    // TODO: updateIndexState
  }

  async loadIndexState () {
    // eslint-disable-next-line
    console.log('loadIndexState');
    // TODO: loadIndexState
  }
}

module.exports = ActionHandler;
