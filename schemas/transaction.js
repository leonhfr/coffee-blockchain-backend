const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  producerId: {
    type: Sequelize.UUID,
    defaultValue: null
  },
  customerId: {
    type: Sequelize.UUID,
    defaultValue: null
  },
  shippingId: {
    type: Sequelize.UUID,
    defaultValue: null
  },
  quantity:Sequelize.SMALLINT,
  price: Sequelize.DECIMAL
  
});
