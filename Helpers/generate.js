module.exports.generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  // Initialize Math.random() with a new seed
  const seed = new Date().getTime();
  Math.random(seed);

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

module.exports.generateRandomNumber = (length) => {
  const characters =
    "0123456789";

  let result = "";

  // Initialize Math.random() with a new seed
  const seed = new Date().getTime();
  Math.random(seed);

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};