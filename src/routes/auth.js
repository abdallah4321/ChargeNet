import express from 'express';
import {
  forgetPassword,
  login,
  register,
  ResetPassword,
} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', ResetPassword);

export default router;
