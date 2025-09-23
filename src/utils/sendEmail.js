import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, cc, text, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    cc,
    subject,
    text,
    html,
  });
};

export default sendEmail;
