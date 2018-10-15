const md5 = require('md5');
const Customer = require('../../../schemas/customer');
const Producer = require('../../../schemas/producer');

async function upsertUser (state, payload, blockInfo, context) {
  try {
    const { user, role, hash } = payload.data;
    let foundUser;
    //eslint-disable-next-line
    console.log(`Upsert user: user: ${user} | role: ${role} | hash: ${hash}`);
    // TODO: check information with database and update/insert user
    // and switch from pending to confirmed as appropriate
    if (role === 'consumer') {
      foundUser = await Customer.find({
        where: { customer_name: user }
      });
      const {
        customer_name,
        country,
        description,
        geo_location,
        email
      } = foundUser.dataValues;
      const bodyToCheck = JSON.stringify({
        customer_name,
        country,
        geo_location,
        description,
        email
      });
      if (hash === md5(bodyToCheck)) {
        Customer.update(
          { confirmed: true },
          { returning: true, plain: true, where: { customer_name: user } }
        );
        console.log('CONFIRMED');
      } else {
        console.log('NOT CONFIRMED: ', hash, md5(bodyToCheck));
      }
    } else if (role === 'producer') {
      foundUser = await Producer.find({
        where: { business_name: user }
      });
      const {
        business_name,
        country,
        description,
        email
      } = foundUser.dataValues;
      const bodyToCheck = JSON.stringify({
        business_name,
        country,
        description,
        email
      });
      if (hash === md5(bodyToCheck)) {
        Producer.update(
          { confirmed: true },
          { returning: true, plain: true, where: { business_name: user } }
        );
        console.log('CONFIRMED');
      } else {
        console.log('NOT CONFIRMED: ', hash, md5(bodyToCheck));
      }
    }
  } catch (err) {
    //eslint-disable-next-line
    console.error(err);
  }
}

module.exports = upsertUser;
