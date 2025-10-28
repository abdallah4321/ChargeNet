import express from 'express';
import {
  forgetPassword,
  login,
  register,
  ResetPassword,
} from '../controllers/authControllers.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../validators/UserValidations.js';

const router = express.Router();

router.post('/login', validateBody(loginSchema), login);
router.post('/register', validateBody(registerSchema), register);
router.post(
  '/forget-password',
  validateBody(forgetPasswordSchema),
  forgetPassword
);
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ResetPassword
);

export default router;
