import Payment from '../models/PaymentModels.js';
import { confirmBookingAfterPayment } from '../sevrices/BookingServices.js';
import APIError from "../utils/apiError.js";
  
export const createPayment = async (data) => {
  return await Payment.create(data);
};



export const handleCallback = async (orderId, success, paymentId) => {
  const payment = await Payment.findOne({ orderId });
  if (!payment) throw new APIError("Payment not found");

  payment.status = success === "true" ? "completed" : "failed";
  await payment.save();

  if (payment.status === "completed") {
    await confirmBookingAfterPayment(payment.BookingId, payment._id);
  }

  return payment;
};


export const findPaymentById = async (id) => {
  return await Payment.findById(id).populate('userId', 'name email');
};

export const getAllPayments = async () => {
  return await Payment.find().populate('userId', 'name email');
};



 
export const updatePaymentByOrderId = async (orderId, data) => {
  return await Payment.findOneAndUpdate({ orderId }, data, {
    new: true,
  });
};
 
