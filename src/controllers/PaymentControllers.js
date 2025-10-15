 import { getBookingAmountById } from "../dataAccess/Booking.dataAccess.js";
import { getPaymentById, getALLPayments, handleCallback, initiatePayment } from "../sevrices/paymentService.js";

export const createPayment = async (req, res, next) => {
  try {
    const { orderId , billingData } = req.body;
 
  if (!orderId || !billingData) {
      return res.status(400).json({ error: 'Missing orderId or billingData' });
    }

    // Fetch the booking amount using the orderId (which is the booking ID)
    const amount = await  getBookingAmountById(orderId);
     console.log('Amount for booking:', amount);
     
    const payment = await initiatePayment(
   { id: req.user.id },  // user
   amount,               // amount
   billingData           // billingData
);


    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

export const paymentCallback = async (req, res, next) => {
  try {
    const { id, success, order } = req.query;
    if (!id || !order) {
      return res.status(400).json({ error: 'Missing id or order_id' });
    }

    await handleCallback(order, success, id);

    res.json({ message: 'Payment status updated' });
  } catch (err) {
    next(err);
  }
};

export const getPaymentByID = async (req, res, next) => {
  try {
    const payment = await getPaymentById(req.params.id); 
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    } 
    res.json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }

};

export const getAllPayment = async (req, res, next) => {
  try {
    const payments = await getALLPayments();
    res.json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
};