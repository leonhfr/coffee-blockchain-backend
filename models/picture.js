const Picture = require('../schemas/picture');

exports.createPicture = async picture => {
  let newPicture = await Picture.create({
    id: picture.id,
    customerId: picture.customerId,
    url: picture.url
  });
  return newPicture;
};
