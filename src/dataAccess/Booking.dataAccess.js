import Booking from "../models/BookingModels.js";
import APIError from "../utils/apiError.js";

export const createBooking = async (data) => {
  try {
    return await Booking.create(data);
  } catch (error) {
    throw new APIError(`Error creating booking: ${error.message}`, 500);
  }
};

export const getBookingById = async (id) => {
  try {
    const booking = await Booking.findById(id)
      .populate("user", "name email phone role")
      .populate("vehicle", "name type powerKW status")
      .populate({
        path: "unit",
        populate: {
          path: "stationId",
          select: "name location address"
        }
      })
      .populate('payment');

    if (!booking) {
      throw new APIError("Booking not found", 404);
    }
    
    return booking;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(`Error fetching booking: ${error.message}`, 500);
  }
};

export const getBookingAmountById = async (id) => {
  try {
    const booking = await Booking.findById(id).select("amount");
    if (!booking) {
      throw new APIError("Booking not found", 404);
    }
    return booking.amount;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(`Error fetching booking amount: ${error.message}`, 500);
  }
};

export const getAllBookings = async (filters = {}) => {
  try {
    const { status, user, page = 1, limit = 10 } = filters;
    
    const query = {};
    if (status) query.status = status;
    if (user) query.user = user;

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate("user", "name email")
      .populate("vehicle", "name type")
      .populate({
        path: "unit",
        populate: {
          path: "stationId",
          select: "name location"
        }
      })
      .populate("payment", "amount status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new APIError(`Error fetching bookings: ${error.message}`, 500);
  }
};

export const updateBooking = async (id, data) => {
  try {
    const booking = await Booking.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    })
      .populate("user", "name email phone")
      .populate({
        path: "unit",
        populate: {
          path: "stationId",
          select: "name location"
        }
      });

    if (!booking) {
      throw new APIError("Booking not found", 404);
    }
    
    return booking;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(`Error updating booking: ${error.message}`, 500);
  }
};

export const deleteBooking = async (id) => {
  try {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      throw new APIError("Booking not found", 404);
    }
    return booking;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(`Error deleting booking: ${error.message}`, 500);
  }
};

export const confirmBookingAfterPayment = async (bookingId, paymentId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new APIError("Booking not found", 404);

    booking.payment = paymentId;
    booking.status = "confirmed";
    await booking.save();

    return await getBookingById(bookingId);
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(`Error confirming booking: ${error.message}`, 500);
  }
};

export const cancelBooking = async (id) => {
  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      throw new APIError("Booking not found", 404);
    }

    if (booking.status === "cancelled") {
      throw new APIError("Booking already cancelled", 400);
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    return await getBookingById(id);
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(`Error cancelling booking: ${error.message}`, 500);
  }
};

export const findOverlappingBookings = async (unitId, startTime, endTime, excludeId = null) => {
  try {
    const query = {
      unit: unitId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return await Booking.find(query);
  } catch (error) {
    throw new APIError(`Error finding overlapping bookings: ${error.message}`, 500);
  }
};