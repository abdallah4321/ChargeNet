import {
  createBooking,
  getAllBookings,
  getBookingById,
} from '../dataAccess/Booking.dataAccess.js';
import Booking from '../models/BookingModels.js';
import Payment from '../models/PaymentModels.js';
import Units from '../models/UnitsModels.js';
import APIError from '../utils/apiError.js';

export const createBookings = async ({
  user: userId,
  vehicle,
  unit: unitId,
  startTime,
  endTime,
 }) => {
  if (!unitId || !startTime || !endTime) {
    throw new APIError('Missing required fields', 400);
  }
  // prevent overlapping bookings for same unit
  const overlappingBooking = await Booking.findOne({
    unit: unitId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });
  if (overlappingBooking) {
    throw new APIError('This unit is already booked in that period', 400);
  }

  // startTime must be in the future
  if (new Date(startTime) < new Date()) {
    throw new APIError('Start time must be in the future', 400);
  }

  const unit = await Units.findById(unitId);
 
  if (!unit) throw new APIError('Unit not found', 400);
  if (unit.status !== 'available') {
    throw new APIError('Unit not available', 400);
  }

  // duration in hours
  const durationHours =
    (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);

  if (durationHours <= 0) {
    throw new APIError('Invalid booking time', 400);
  }

  // total amount
  const amount = durationHours * unit.pricePerHour;  


  // create booking
  const booking = await createBooking({
    user: userId,
    unit: unitId,
    vehicle, 
    startTime,
    endTime,
    status: 'pending',
    amount,
  });
  return booking; 
};

export const confirmBookingAfterPayment = async (bookingId, paymentId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new APIError('Booking not found', 404);

  booking.payment = paymentId;
  booking.status = 'confirmed';
  await booking.save();

  const payment = await Payment.findById(booking.payment);
  if (payment && payment.status === 'pending') {
    payment.status = 'completed';
    await payment.save();
  }

  return booking;
};



export const getBookingByID = async (id) => {
  return await getBookingById(id);
};


export const getAllBooking = async () => {
  return await getAllBookings();
};



export const cancelBooking = async (id, userId, isAdmin = false) => {
  const booking = await getBookingById(id);
  if (!booking) throw new APIError('Booking not found', 404);

  if (!isAdmin && booking.user._id.toString() !== userId.toString()) {
    throw new APIError('Not authorized to cancel this booking', 403);
  }

  if (['cancelled', 'completed'].includes(booking.status)) {
    throw new APIError('Booking cannot be cancelled', 400);
  }

  booking.status = 'cancelled';
  await booking.save();

  const payment = await Payment.findById(booking.payment);
  if (payment && payment.status === 'paid') {
    payment.status = 'refunded';
    await payment.save();
  }

  return booking;
};