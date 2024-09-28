const Account = require('../../models/account.model');
const jwt = require('jsonwebtoken');
const generateHelper = require('../../helpers/generate.helper');

// [POST] /admin/reset-token
module.exports.resetToken = async (req, res) => {
    const bearer = req.headers.authorization;
    const refreshTokenBear = bearer.split(' ')[1];
    try {
        const payload = jwt.verify(refreshTokenBear, process.env.REFRESH_TOKEN_SECRET);
        const {accessToken, refreshToken} = generateHelper.jwtToken({id : payload.id});
        await Account.updateOne({
            _id : payload.id,
            refreshToken : refreshTokenBear
        }, {
            refreshToken : refreshToken
        })
        res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 30*60*1000)}); // 30m
        res.cookie("refreshToken", refreshToken, { expires: new Date(Date.now() + 3*24*60*60*1000)}); // 3d
        res.json({
            code : 200
        })
    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({
            code : 401
        })
    }
}