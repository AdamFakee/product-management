
const jwt = require('jsonwebtoken')

const generateToken = (payload) => {  // taọ token
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30m'
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '3d'
  });

  return {accessToken, refreshToken};
}

module.exports.jwtNomal = async (user, model, res, contentUpdate='') => {   
  const {accessToken, refreshToken} = generateToken({id : user.id, cartId : user.cartId}); // generate token
  const newContent = {
    refreshToken : refreshToken,
  };
  for (const key in contentUpdate) {
    newContent[key] = contentUpdate[key];
  }
  await model.updateOne({
    _id : user.id
  }, newContent);
  res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 7*24*60*60*1000)});
  res.cookie("refreshToken", refreshToken, { expires: new Date(Date.now() + 20*24*60*60*1000)});
  return;
}

