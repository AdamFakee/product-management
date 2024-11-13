const jwt = require("jsonwebtoken");
const {redis} = require("../config/ioredis.config");

// ioredis


module.exports.addToWhiteListToken = async (jwtToken, keyName, res) => {
    let payload = null;
    if(keyName == 'accessToken') {
        payload = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
    } else if(keyName == 'refreshToken') {
        payload = jwt.verify(jwtToken, process.env.REFRESH_TOKEN_SECRET);

    }

    if(!payload) {
        return false;
    }

    const score = payload.exp * 1000; // format Date.now() , score is ttl of token
    const nameValue = `${jwtToken}`; // name = token:ipDevice
    await redis.zadd(keyName, 'NX', score, nameValue); // if already exist => not CRUD
    return true;
}


module.exports.checkExistInWhiteListToken = async (payload, keyName) => {
    const score = payload.exp * 1000;
    const blackListToken = await redis.zrangebyscore(keyName, score, score);
    if(blackListToken.length == 1) {
        return true;
    } 
    return false;
}

module.exports.removeInWhiteListToken = async (payload, keyName) => {
    const score = payload.exp * 1000;
    await redis.zremrangebyscore(keyName, score, score);
    return;
}

// keyName in white list
const RT_keyName = "refreshToken";
const AT_keyName = "accessToken";

// register => add token to whiteList
module.exports.addToken_WhenRegister = async (res, accessToken, refreshToken) => {
    // add accessToken
    await this.addToWhiteListToken(accessToken, AT_keyName, res);
    // add refreshToken
    await this.addToWhiteListToken(refreshToken, RT_keyName, res);
    return;
}

// logout => remove token in whiteList
module.exports.removeToken_WhenLogout = async (AT_payload, RT_payload) => {
    // remove accessToken
    await this.removeInWhiteListToken(AT_payload, AT_keyName);
    // remove refreshToken
    await this.removeInWhiteListToken(RT_payload, RT_keyName);
    return;
}