import { paymob } from '../utils/paymob.js';
import dotenv from 'dotenv';
import {
  createPayment,
  findPaymentByOrderId,
  updatePaymentByOrderId,
  findPaymentById,
  getAllPayments,
} from '../dataAccess/payment.dataAcess.js';
import { confirmBookingAfterPayment } from './BookingServices.js';
import APIError from '../utils/apiError.js';

dotenv.config();
const PAYMOB_BASE_URL = process.env.PAYMOB_API_URL;

export const createPaymentLink = async (user, bookingId, amount, billingData) => {
  try {
    // 1. Authenticate with Paymob
    const token = await paymob.authenticate();
    // 2. Create order in Paymob
    const order = await paymob.createOrder(token, amount); 
    // 3. Generate payment key
    const paymentKey = await paymob.generatePaymentKey(
      token,
      order.id,
      amount,
      billingData
    );
    // 4. Create payment record
    const payment = await createPayment({
      userId: user.id,
      bookingId: bookingId,
      paymobOrderId: order.id.toString(),
      amount: amount,
      status: 'pending',
      iframeUrl: `${PAYMOB_BASE_URL}/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`
    });
    return {
      paymentId: payment._id,
      iframeUrl: payment.iframeUrl,
      paymobOrderId: payment.paymobOrderId
    };
  } catch (error) {
    console.error(' Error creating payment link:', error);
    throw new APIError(`Payment link creation failed: ${error.message}`, 500);
  }
};

export const handlePaymentCallback = async (orderId, success, transactionId) => {
  try {
    // Find payment by Paymob order ID
    const payment = await findPaymentByOrderId(orderId);
    
    if (!payment) {
      console.error(` Payment not found for Paymob order: ${orderId}`);
      throw new APIError(`Payment not found for Paymob order: ${orderId}`, 404);
    }

    const paymentStatus = success ? 'completed' : 'failed';
    
    
    // Update payment status
    const updatedPayment = await updatePaymentByOrderId(orderId, {
      status: paymentStatus,
      transactionRef: transactionId,
    });

    let bookingConfirmed = false;

    // If payment successful, try to confirm booking
    if (paymentStatus === 'completed') {
      try {
        await confirmBookingAfterPayment(payment.bookingId._id, payment._id);
        bookingConfirmed = true;
      } catch (bookingError) {
        console.error(` Failed to confirm booking: ${bookingError.message}`);
        bookingConfirmed = false;
      }
    }

    return {
      payment: updatedPayment,
      bookingConfirmed: bookingConfirmed
    };
  } catch (error) {
    console.error(' Error handling payment callback:', error);
    throw new APIError(`Payment callback failed: ${error.message}`, 500);
  }
};

export const getPaymentById = async (id) => {
  return await findPaymentById(id);
};

export const getAllPaymentsService = async (filters = {}) => {
  return await getAllPayments(filters);
};