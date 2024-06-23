const nodemailer = require("nodemailer");
require('dotenv').config();

// Correct export syntax
module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS // Use "pass" instead of "password"
      }
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email not sent");
    console.error(error);
  }
};
