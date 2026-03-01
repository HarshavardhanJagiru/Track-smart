const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const sendEmail = async (options) => {
    console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
    // Remove quotes if present
    const pass = process.env.EMAIL_PASS.replace(/^"|"$/g, '');

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: process.env.EMAIL_PORT || 465,
        secure: process.env.EMAIL_PORT == 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: pass
        }
    });

    const mailOptions = {
        from: `"SmartJob Tracker Test" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to self for testing
        subject: 'Test Email from Smart Job Tracker',
        text: 'This is a test email to verify SMTP configuration.',
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
    } catch (error) {
        console.error('❌ Email failed:', error);
    }
};

sendEmail();
