const rateLimit = require('express-rate-limit');

// initial limit 
const limiter = (windowMs, limitHit, message) => rateLimit({
	windowMs: windowMs, 
	limit: limitHit, 
	standardHeaders: true, 
	legacyHeaders: false, 
    message : message,
    handler: (req, res, next, options) => {
        req.flash('error', options.message);
        res.redirect('/user/login');
        return;
    }
})

module.exports.limiter = limiter;