const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')

module.exports = () => {
    // Cấu hình Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/user/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        // Xử lý thông tin người dùng (profile)
        return done(null, profile);
    }));

    // xác thực thành công => call serializeUser =>  truyền object profile vô rồi lưu nơi sesion
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // được gọi khi cần lấy data => data trả về lưu ở req, cụ thể là req.user
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}