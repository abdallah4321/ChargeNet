import express from 'express';
const router = express.Router();

import * as bookingController from '../controllers/BookingController.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { checkRole, protect } from '../middleware/auth.js';
import { BookingValidations } from '../validators/BookingValiations.js';

router.post(
  '/',
  protect,
  validateBody(BookingValidations),
  bookingController.createBooking
);

router.get(
  '/:id',
  protect,
  checkRole(['owner', 'Driver', 'superadmin']),
  bookingController.getBookingById
);
router.get(
  '/',
  protect,
  checkRole(['owner', 'superadmin']),
  bookingController.getAllBookings
);



router.post('/:id/cancel', protect, bookingController.cancelBooking);

export default router;
