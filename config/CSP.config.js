
// CSP : tránh các attacker gán link + script.js vào web của mình
//       đại khái là nó quy định các link nào được dùng 
//       và ở đây : sử dụng nonce để nhận dạng file script nào là của mình để chạy file đó


const crypto = require('crypto');

module.exports.CspConfig = (app) => {
    app.use((req, res, next) => {
        const nonce = crypto.randomUUID();
            res.setHeader(
                'Content-Security-Policy',
                `default-src 'self'; font-src 'self' https://cdnjs.cloudflare.com https://ka-f.fontawesome.com https://fontawesome.com; img-src 'self' http://res.cloudinary.com https://lh3.googleusercontent.com; script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net https://kit.fontawesome.com/6e59f23f40.js; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css; frame-src 'self'; connect-src 'self' https://ka-f.fontawesome.com`
            );
            app.locals.nonceValue = nonce;
            next();
        }
    );
};