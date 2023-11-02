const crypto = require('crypto')

module.exports.generateRandomString = (length) => {
  const seed = new Date().getTime();

  const conver = Math.random(seed);
  const token = crypto.randomBytes(length).toString('hex')+conver;
  return token;
};

module.exports.generateRandomNumber = (length) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); // Số ngẫu nhiên từ 0 đến 9
  }
  return result;
};