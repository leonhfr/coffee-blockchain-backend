const Transaction = require('../schemas/transaction');
const Shipper = require('../schemas/shipper');

exports.createShipper = async shipper => {
  const res = await Shipper.create({
    id: shipper.id,
    shipper_name: shipper.shipper_name,
    country: shipper.country,
    description: shipper.description
  });
  return res;
};

exports.getShippers = async () => {
  const res = await Shipper.findAll({
    include: [Transaction]
  });
  return res;
};
