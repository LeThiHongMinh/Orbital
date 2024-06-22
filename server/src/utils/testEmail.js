const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: 'lethihongminh2005@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email',
    });

    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Test email not sent');
    console.error(error);
  }
};

testEmail();
