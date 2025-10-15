import express from 'express';
const router = express.Router();

import { checkRole, protect } from '../middleware/auth.js';
import {
  createPayment,
  getAllPayment,
  getPaymentByID,
  paymentCallback,
} from '../controllers/PaymentControllers.js';

import { PaymentInitiateValidation } from '../validators/PaymentValidations.js';
import { validateBody } from '../middleware/validateMiddleware.js';

router.post(
  '/pay',
  protect,
  checkRole(['Driver', 'owner' , 'superadmin']),
  validateBody(PaymentInitiateValidation),
  createPayment
);

router.post('/getPayment/:id', protect, checkRole(['owner', 'superadmin']), getPaymentByID);
router.get('/', protect, checkRole(['owner', 'superadmin']), getAllPayment);
router.get('/callback', paymentCallback);

export default router;
