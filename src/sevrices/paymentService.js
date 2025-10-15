import Payment from "../models/PaymentModels.js";
import APIError from "../utils/apiError.js";
import { confirmBookingAfterPayment } from "./BookingServices.js";
import { paymob } from "../utils/paymob.js";
import dotenv from "dotenv";
import { createPayment, findPaymentById, getAllPayments, updatePaymentByOrderId } from "../dataAccess/payment.dataAcess.js";
dotenv.config();
const PAYMOB_BASE_URL = process.env.PAYMOB_API_URL;

 export const initiatePayment = async (user, amount, billingData) => {
  const token = await paymob.authenticate();
  const order = await paymob.createOrder(token, amount);
  const paymentKey = await paymob.generatePaymentKey(token, order.id, amount, billingData);

  const payment = await createPayment({
    userId: user.id,
    orderId: order.id,
    amount,
    status: "pending",
  });

  return {
    iframeUrl: `${PAYMOB_BASE_URL}/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`,
    payment,
  };
};

export const handleCallback = async (orderId, success, id) => {
  const paymentStatus = success ? "completed" : "failed";
  if (!paymentStatus) throw new APIError("Payment not found");

  Payment.status = success === "true" ? "completed" : "failed";
  await Payment.save();

  if (Payment.status === "completed") {
    await confirmBookingAfterPayment(Payment.BookingId, Payment._id);
  }

return updatePaymentByOrderId(orderId, {
    status: paymentStatus,
    transactionRef: id,
  });};


 

export const getPaymentById = async (id) => {
  return await findPaymentById(id);
};

export const getALLPayments = async () => {
  return await getAllPayments();
};


 