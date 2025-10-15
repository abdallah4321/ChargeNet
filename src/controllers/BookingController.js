import * as bookingService from '../sevrices/BookingServices.js';

export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    req.body.user = userId;

     const booking = await bookingService.createBookings(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingByID(req.params.id);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBooking();
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'superadmin';
    const booking = await bookingService.cancelBooking(
      req.params.id,
      userId,
      isAdmin
    );
    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (err) {
    next(err);
  }
};
