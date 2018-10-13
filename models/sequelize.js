const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

sequelize
  .sync()
  .then(() => {
    console.log('Sequelize connected to MySQL.'); //eslint-disable-line
  })
  .catch(e => console.error(e)); //eslint-disable-line

module.exports = sequelize;
