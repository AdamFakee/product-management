module.exports.generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    let result = "";
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  };

// random OTP - forgot password
module.exports.OTP = (length) => {
  const numbers = '0123456789';
  let result = '';

  for(let i = 0; i < length; i++){
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  };
  return result;
}

// jwt sign - accessToken, refreshToken
const jwt = require('jsonwebtoken')

module.exports.jwtToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30m'
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '3d'
  });

  return {accessToken, refreshToken};
}