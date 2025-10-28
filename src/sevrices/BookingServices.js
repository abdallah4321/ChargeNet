import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  findOverlappingBookings,
  confirmBookingAfterPayment as confirmBookingPayment,
} from '../dataAccess/Booking.dataAccess.js';
import {
  scheduleChargeReminder,
  cancelChargeReminder,
} from '../jobs/chargeReminder.js';
import Units from '../models/UnitsModels.js';
import Payment from '../models/PaymentModels.js';
import APIError from '../utils/apiError.js';
import Users from '../models/UsersModels.js';

export const createBookings = async ({
  user: userId,
  vehicle,
  unit: unitId,
  startTime,
  endTime,
}) => {
  // Validate required fields
  if (!unitId || !startTime || !endTime || !vehicle) {
    throw new APIError(
      'All fields are required: unit, vehicle, start time, end time',
      400
    );
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  // Validate dates
  if (start < now) {
    throw new APIError('Start time must be in the future', 400);
  }

  if (end <= start) {
    throw new APIError('End time must be after start time', 400);
  }

  // Check for overlapping bookings
  const overlappingBookings = await findOverlappingBookings(unitId, start, end);
  if (overlappingBookings.length > 0) {
    throw new APIError(
      'This unit is already booked for the selected time period',
      400
    );
  }

  // Find unit and user
  const unit = await Units.findById(unitId).populate('stationId');
  if (!unit) {
    throw new APIError('Unit not found', 404);
  }

  const user = await Users.findById(userId);
  if (!user) {
    throw new APIError('User not found', 404);
  }

  if (unit.status !== 'available') {
    throw new APIError('Unit is not available', 400);
  }

  // Calculate duration and amount
  const durationHours = (end - start) / (1000 * 60 * 60);
  if (durationHours <= 0) {
    throw new APIError('Invalid booking duration', 400);
  }

  const amount = Math.round(durationHours * unit.pricePerHour * 100) / 100;

  // Create booking
  const booking = await createBooking({
    user: userId,
    unit: unitId,
    vehicle,
    startTime: start,
    endTime: end,
    status: 'pending',
    amount,
  });

  // Return populated booking
  return await getBookingById(booking._id);
};

export const confirmBookingAfterPayment = async (bookingId, paymentId) => {
  try {    
    const booking = await getBookingById(bookingId);
  
    if (!booking) {
      throw new APIError('Booking not found', 404);
    }
    // If booking is already confirmed, just return it
    if (booking.status === 'confirmed') {
      return booking;
    }

    // If booking is not pending, we cannot confirm it
    if (booking.status !== 'pending') {
      throw new APIError(`Booking cannot be confirmed because it's ${booking.status}`, 400);
    }

    // Update booking with payment reference and confirm status
    const updatedBooking = await updateBooking(bookingId, {
      payment: paymentId,
      status: 'confirmed'
    });

    // Schedule charge reminder 20 minutes before charging time
    try {
      if (updatedBooking.unit && updatedBooking.unit.station) {
        await scheduleChargeReminder({
          userEmail: updatedBooking.user.email,
          userName: updatedBooking.user.name,
          chargeTime: updatedBooking.startTime,
          stationName: updatedBooking.unit.station.name,
          stationLocation: updatedBooking.unit.station.location,
          bookingId: updatedBooking._id
        });
        
      } else {
      }
    } catch (error) {
      console.error(' Failed to schedule charge reminder:', error.message);
      // Don't throw error, just log it
    }

    return updatedBooking;
  } catch (error) {
    console.error(` Error confirming booking ${bookingId}:`, error.message);
    throw error;
  }
};

export const getBookingByID = async (id) => {
  return await getBookingById(id);
};

export const getAllBooking = async (filters = {}) => {
  return await getAllBookings(filters);
};

export const cancelBooking = async (id, userId, isAdmin = false) => {
  const booking = await getBookingById(id);
  if (!booking) {
    throw new APIError('Booking not found', 404);
  }

  // Check authorization
  if (!isAdmin && booking.user._id.toString() !== userId.toString()) {
    throw new APIError('Not authorized to cancel this booking', 403);
  }

  if (['cancelled', 'completed'].includes(booking.status)) {
    throw new APIError(
      `Cannot cancel booking because it's ${booking.status}`,
      400
    );
  }

  // Cancel charge reminder
  try {
    await cancelChargeReminder(id);
    console.log(` Charge reminder cancelled for booking ${id}`);
  } catch (error) {
    console.error(' Failed to cancel charge reminder:', error.message);
  }

  // Update booking status
  const updatedBooking = await updateBooking(id, {
    status: 'cancelled',
    cancelledAt: new Date(),
  });

  // Handle payments
  if (booking.payment) {
    const payment = await Payment.findById(booking.payment);
    if (payment && payment.status === 'paid') {
      payment.status = 'refunded';
      payment.refundedAt = new Date();
      await payment.save();
    }
  }

  return updatedBooking;
};

export const activateBooking = async (bookingId) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new APIError('Booking not found', 404);
  }

  if (booking.status !== 'confirmed') {
    throw new APIError('Booking must be confirmed before activation', 400);
  }

  if (new Date() < booking.startTime) {
    throw new APIError('Cannot activate booking before start time', 400);
  }

  const updatedBooking = await updateBooking(bookingId, {
    status: 'active',
    actualStartTime: new Date(),
  });

  // Update unit status
  await Units.findByIdAndUpdate(booking.unit._id, { status: 'occupied' });

  return updatedBooking;
};

export const completeBooking = async (bookingId) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new APIError('Booking not found', 404);
  }

  if (booking.status !== 'active') {
    throw new APIError('Only active bookings can be completed', 400);
  }

  const updatedBooking = await updateBooking(bookingId, {
    status: 'completed',
    actualEndTime: new Date(),
  });

  // Reset unit status
  await Units.findByIdAndUpdate(booking.unit._id, { status: 'available' });

  return updatedBooking;
};

export const getUserBookings = async (userId, filters = {}) => {
  const userBookings = await getAllBookings({ ...filters, user: userId });
  return userBookings;
};

export const updateBookingTime = async (
  bookingId,
  newStartTime,
  newEndTime,
  userId,
  isAdmin = false
) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new APIError('Booking not found', 404);
  }

  // Check authorization
  if (!isAdmin && booking.user._id.toString() !== userId.toString()) {
    throw new APIError('Not authorized to update this booking', 403);
  }

  if (['cancelled', 'completed', 'active'].includes(booking.status)) {
    throw new APIError(`Cannot update ${booking.status} booking`, 400);
  }

  const start = new Date(newStartTime);
  const end = new Date(newEndTime);
  const now = new Date();

  // Validate new dates
  if (start < now) {
    throw new APIError('New start time must be in the future', 400);
  }

  if (end <= start) {
    throw new APIError('New end time must be after start time', 400);
  }

  // Check for overlapping bookings
  const overlappingBookings = await findOverlappingBookings(
    booking.unit._id,
    start,
    end,
    bookingId
  );

  if (overlappingBookings.length > 0) {
    throw new APIError('Unit is already booked for the new time period', 400);
  }

  // Calculate new duration and amount
  const durationHours = (end - start) / (1000 * 60 * 60);
  const newAmount =
    Math.round(durationHours * booking.unit.pricePerHour * 100) / 100;

  // Update charge reminder
  try {
    await cancelChargeReminder(bookingId);

    await scheduleChargeReminder({
      userEmail: booking.user.email,
      userName: booking.user.name,
      chargeTime: start,
      stationName: booking.unit.station.name,
      stationLocation: booking.unit.station.location,
      bookingId: bookingId,
    });

    console.log(` Charge reminder updated for booking ${bookingId}`);
  } catch (error) {
    console.error(' Failed to update charge reminder:', error.message);
  }

  // Update booking
  const updatedBooking = await updateBooking(bookingId, {
    startTime: start,
    endTime: end,
    amount: newAmount,
  });

  return updatedBooking;
};


