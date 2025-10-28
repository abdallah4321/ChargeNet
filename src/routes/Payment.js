import express from 'express';
const router = express.Router();

import { checkRole, protect } from '../middleware/auth.js';
import {
  createPayment,
  getAllPayment,
  getPaymentByID,
  paymentCallback,
  getUserPayments,
} from '../controllers/PaymentControllers.js';

import { PaymentInitiateValidation } from '../validators/PaymentValidations.js';
import { validateBody } from '../middleware/validateMiddleware.js';

// 🔥 PUBLIC CALLBACK ROUTES - MUST BE FIRST
router.get('/callback', paymentCallback);  // GET for Paymob callbacks
router.post('/callback', paymentCallback); // POST for testing

// 🔒 PROTECTED ROUTES
router.use(protect);

// User routes
router.post(
  '/create-link',
  validateBody(PaymentInitiateValidation),
  createPayment
);

router.get(
  '/my-payments',
  getUserPayments
);

router.get(
  '/:id',
  getPaymentByID
);

// Admin only routes
router.get(
  '/',
  checkRole(['owner', 'superadmin']),
  getAllPayment
);

export default router;