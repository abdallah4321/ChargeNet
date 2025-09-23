import { createUser, findUserByEmail } from '../dataAccess/user.dataAccess.js';
import APIError from '../utils/apiError.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';
import {
  forgetPasswordSchema,
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from '../validators/UserValidations.js';
import { sendResetToken, resetPassword } from '../sevrices/authService.js';

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    console.log(error);

    if (error) {
      throw new APIError(error.details[0].message, 400);
    }
    const existingEmail = await findUserByEmail(req.body.email);
    if (existingEmail) {
      throw new APIError('Email already exists', 400);
    }

    const newUser = await createUser(req.body);
    const token = generateToken(newUser);
    res.status(201).json({
      message: 'User created successflly',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw new APIError('email or password not valid', 400);
    }

    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      throw new APIError('email or password not valid ', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new APIError('Invalid password', 401);
    }

    const token = generateToken(user);
    res.status(200).json({
      message: 'login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { error } = forgetPasswordSchema.validate(req.body);
    if (error) throw new APIError(error.details[0].message, 400);

    const { email } = req.body;
    await sendResetToken(email);

    res.json({ message: 'Reset link has been sent to your email' });
  } catch (err) {
    next(err);
  }
};

export const ResetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) throw new APIError(error.details[0].message, 400);

    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    next(err);
  }
};
