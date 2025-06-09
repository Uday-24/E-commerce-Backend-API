require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: `E-com backend api <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        text
    }
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;