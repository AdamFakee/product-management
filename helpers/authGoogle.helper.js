const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')

module.exports = () => {
    // Cấu hình Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/user/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        
        // Xử lý thông tin người dùng (profile)
        return done(null, profile);
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}