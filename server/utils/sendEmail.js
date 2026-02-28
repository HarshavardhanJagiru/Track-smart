const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if credentials exist, otherwise mock the email for local development
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ SMTP credentials not configured in .env file (EMAIL_USER, EMAIL_PASS).');
        console.log('--- 📧 MOCK EMAIL DISPATCH ---');
        console.log('To:', options.email);
        console.log('Subject:', options.subject);
        console.log('Content/Link:', options.html);
        console.log('------------------------------');
        return; // Gracefully continue without actually calling SMTP
    }

    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: process.env.EMAIL_PORT || 465,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: `"SmartJob Tracker" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
