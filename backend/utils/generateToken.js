const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  console.log("Generating token for user ID:", userId); // debug
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
