import Booking from "../models/BookingModels.js";
import APIError from "../utils/apiError.js";

export const createBooking = async (data) => {
  return await Booking.create(data);
};

export const getBookingById = async (id) => {
  return await Booking.findById(id)
    .populate("user", "name email phone role")
    .populate("vehicle", "name type powerKW status")
    .populate("unit", "name unitType status pricePerHour")
  .populate('payment')
  .lean(); // يخليها Object عادي
};

export const getBookingAmountById = async (id) => {
  const booking = await Booking.findById(id).select("amount");
  if (!booking) {
    throw new APIError("Booking not found", 404);
  }
  return booking.amount;
};

export const getAllBookings = async () => {
  return await Booking.find()
    .populate("user", "name email")
    .populate("vehicle", "name type")
    .populate("payment", "amount status")
    .select("startTime endTime status");
};

export const updateBooking = async (id, data) => {
  return await Booking.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBooking = async (id) => {
  return await Booking.findByIdAndDelete(id);
};

 export const confirmBookingAfterPayment = async (bookingId, paymentId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new APIError("Booking not found" , 404);

  booking.payment = paymentId;
  booking.status = "confirmed";
  await booking.save();

  return booking;
};


export const cancelBooking = async (id) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new APIError("Booking not found" , 404);
  }

   if (booking.status === "cancelled") {
    throw new APIError("Booking already cancelled" , 400);
  }

  booking.status = "cancelled";
  await booking.save();

  return booking;
};
