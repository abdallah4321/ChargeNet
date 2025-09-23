import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import APIError from '../utils/apiError.js';
import sendEmail from '../utils/sendEmail.js';
import dotenv from 'dotenv';
import {
  findUserByEmail,
  findUserById,
} from '../dataAccess/user.dataAccess.js';
dotenv.config();

const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || 'reset_secret';

export const sendResetToken = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) throw new APIError('User not found', 404);

  const token = jwt.sign({ id: user.id }, JWT_RESET_SECRET, {
    expiresIn: '15m',
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <center style="width:100%;table-layout:fixed;background:#f3f4f6;padding:40px 0;">
    <table width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      <tr>
        <td style="background:#2563eb;padding:20px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">ChargeNet</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:30px;text-align:center;color:#111827;">
          <h2 style="margin:0 0 16px;font-size:22px;color:#111827;">Reset Your Password</h2>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
            We received a request to reset your password. Click the button below to set a new one.
          </p>
          <a href="${resetLink}"
             style="display:inline-block;padding:12px 24px;background:#2563eb;color:#ffffff;
                    font-size:16px;font-weight:bold;border-radius:8px;text-decoration:none;">
             Reset Password
          </a>
          <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">
            If you didn’t request this, you can safely ignore this email.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">
          © ${new Date().getFullYear()} ChargeNet. All rights reserved.
        </td>
      </tr>
    </table>
  </center>
</body>
`;
  await sendEmail(
    email,
    'Password Reset',
    `Click here to reset password: ${resetLink}`,
    html
  );
};

export const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, JWT_RESET_SECRET);
    const user = await findUserById(decoded.id);
    if (!user) throw new APIError('User not found', 404);
    user.password = newPassword;
    await user.save();
  } catch (err) {
    throw new APIError('Invalid or expired token', 400);
  }
};
