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
    const x = await redis.zadd(keyName, 'NX', score, nameValue); // if already exist => not CRUD
    return true;
}


module.exports.checkExistInWhiteListToken = async (payload, keyName) => {
    const score = payload.exp * 1000;
    const blackListToken = await redis.zrangebyscore(keyName, score, score);
    if(blackListToken.length > 1) {
        return false;
    } 
    return true;
}

module.exports.removeInWhiteListToken = async (payload, keyName) => {
    const score = payload.exp * 1000;
    const blackListToken = await redis.zrangebyscore(keyName, score, score);
    await redis.zremrangebyscore(keyName, score, score);
    return;
}

