import * as bookingService from '../sevrices/BookingServices.js';

export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const booking = await bookingService.createBookings({
      user: userId,
      ...req.body
    });

    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully',
      data: booking 
    });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingByID(req.params.id);
    res.json({ 
      success: true, 
      data: booking 
    });
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getAllBooking(req.query);
    res.json({ 
      success: true, 
      data: result.bookings,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getUserBookings(req.user.id, req.query);
    res.json({ 
      success: true, 
      data: result.bookings,
      pagination: result.pagination
    });
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
    
    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully', 
      data: booking 
    });
  } catch (err) {
    next(err);
  }
};

export const confirmBooking = async (req, res, next) => {
  try {
    const { bookingId, paymentId } = req.body;
    const booking = await bookingService.confirmBookingAfterPayment(bookingId, paymentId);
    
    res.json({ 
      success: true, 
      message: 'Booking confirmed and charge reminder scheduled',
      data: booking 
    });
  } catch (err) {
    next(err);
  }
};

export const activateBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.activateBooking(req.params.id);
    res.json({ 
      success: true, 
      message: 'Booking activated successfully',
      data: booking 
    });
  } catch (err) {
    next(err);
  }
};

export const completeBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.completeBooking(req.params.id);
    res.json({ 
      success: true, 
      message: 'Booking completed successfully',
      data: booking 
    });
  } catch (err) {
    next(err);
  }
};

export const updateBookingTime = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.body;
    const isAdmin = req.user.role === 'superadmin';
    const booking = await bookingService.updateBookingTime(
      req.params.id,
      startTime,
      endTime,
      req.user.id,
      isAdmin
    );

    res.json({ 
      success: true, 
      message: 'Booking time updated successfully',
      data: booking 
    });
  } catch (err) {
    next(err);
  }
};