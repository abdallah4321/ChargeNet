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

const sendEmail = async ({ from, to, subject, cc, text, html }) => {
  try {
    const mailOptions = {
      from: from || `ChargNet <${process.env.EMAIL_USER}>`, // هنا لو ما بعتش from بياخد الديفولت
      to,
      subject,
      text,
      html,
    };

    if (cc && cc.trim() !== '') {
      mailOptions.cc = cc;
    }

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully ✅');
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

export default sendEmail;
