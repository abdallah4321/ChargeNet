import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET || 'supersecretkey';
const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

export const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      name: user.name,
      role: user.role, // superadmin | owner | driver
    },
    secret,
    { expiresIn }
  );

export const verifyToken = (token) => jwt.verify(token, secret);
