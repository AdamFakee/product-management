// gửi mail tự động
const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, text) => {
     // Create a transporter object using Gmail SMTP
     const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_MAIL_USER,
            pass: process.env.SEND_MAIL_PASS
        }
    });

    // Email options
    const mailOptions = {
        from: 'buidinhtuan04@gmail.com',
        to: email,
        subject: subject,
        text: text
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('❌ Error:', error.message);
    } else {
        console.log('✅ Email sent:', 'success');
    }
    });
}