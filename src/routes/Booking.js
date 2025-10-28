import express from 'express';
import * as bookingController from '../controllers/BookingController.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { checkRole, protect } from '../middleware/auth.js';
import { BookingValidations } from '../validators/BookingValiations.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.post(
  '/',
  validateBody(BookingValidations),
  bookingController.createBooking
);

router.get('/my-bookings', bookingController.getUserBookings);

router.get(
  '/:id',
  checkRole(['owner', 'Driver', 'superadmin']),
  bookingController.getBookingById
);

router.post('/:id/cancel', bookingController.cancelBooking);

router.put('/:id/time', bookingController.updateBookingTime);

// Admin only routes
router.get(
  '/',
  checkRole(['owner', 'superadmin']),
  bookingController.getAllBookings
);

router.post(
  '/confirm',
  checkRole(['superadmin']),
  bookingController.confirmBooking
);

router.put(
  '/:id/activate',
  checkRole(['superadmin']),
  bookingController.activateBooking
);

router.put(
  '/:id/complete',
  checkRole(['superadmin']),
  bookingController.completeBooking
);

export default router;
