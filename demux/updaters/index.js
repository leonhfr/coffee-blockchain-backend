const user   = require('./user');
const coffee = require('./coffee');
const sale   = require('./sale');

module.exports = [
  ...user,
  ...coffee,
  ...sale
];
