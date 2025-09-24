import express from 'express';
import {
  forgetPassword,
  login,
  register,
  ResetPassword,
} from '../controllers/authControllers.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../validators/UserValidations.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.post('/forget-password', validate(forgetPasswordSchema), forgetPassword);
router.post('/reset-password', validate(resetPasswordSchema), ResetPassword);

export default router;
