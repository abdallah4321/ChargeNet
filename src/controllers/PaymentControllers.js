import { getBookingAmountById } from "../dataAccess/Booking.dataAccess.js";
import { 
  createPaymentLink, 
  getPaymentById, 
  getAllPaymentsService, 
  handlePaymentCallback 
} from "../sevrices/paymentService.js";
import APIError from '../utils/apiError.js';

export const createPayment = async (req, res, next) => {
  try {
    const { bookingId, billingData } = req.body;

    if (!bookingId || !billingData) {
      throw new APIError('Booking ID and billing data are required', 400);
    }

     const amount = await getBookingAmountById(bookingId);
 
     const paymentLink = await createPaymentLink(
      { id: req.user.id },  // user
      bookingId,            // bookingId
      amount,               // amount
      billingData           // billingData
    );

    res.status(201).json({ 
      success: true, 
      message: 'Payment link created successfully',
      data: paymentLink 
    });
  } catch (err) {
    next(err);
  }
};

export const paymentCallback = async (req, res, next) => {
  try {
    let orderId, transactionId, isSuccess;

    if (req.method === 'GET' && Object.keys(req.query).length > 0) {      
      orderId = req.query.order; // Paymob sends 'order' as query parameter
      transactionId = req.query.id;
      isSuccess = req.query.success === 'true';
    }
    // Handle POST request with JSON body (testing format)
    else if (req.method === 'POST' && req.body) {
      if (req.body.obj) {
        // Paymob Standard Format
        orderId = req.body.obj.order?.id?.toString();
        transactionId = req.body.obj.id?.toString();
        isSuccess = req.body.obj.success === true;
      } else if (req.body.order) {
        // Simplified format
        orderId = req.body.order.id?.toString();
        transactionId = req.body.transactionId || req.body.id;
        isSuccess = req.body.success === true || req.body.success === 'true';
      }
    }

    if (!orderId) {
      throw new APIError('Missing Paymob order ID in callback', 400);
    }

    const result = await handlePaymentCallback(orderId, isSuccess, transactionId);
    res.json({ 
      success: true, 
      message: `Payment processed successfully. Booking ${result.bookingConfirmed ? 'confirmed' : 'not confirmed'}`,
      data: result
    });

  } catch (err) {
    console.error(' Payment callback error:', err);
        res.status(200).json({ 
      success: false, 
      message: 'Callback processed with errors',
      error: err.message 
    });
  }
};

export const getPaymentByID = async (req, res, next) => {
  try {
    const payment = await getPaymentById(req.params.id);
    
    res.json({ 
      success: true, 
      data: payment 
    });
  } catch (err) {
    next(err);
  }
};

export const getAllPayment = async (req, res, next) => {
  try {
    const result = await getAllPaymentsService(req.query);
    
    res.json({ 
      success: true, 
      data: result.payments,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

export const getUserPayments = async (req, res, next) => {
  try {
    const result = await getAllPaymentsService({ 
      userId: req.user.id, 
      ...req.query 
    });
    
    res.json({ 
      success: true, 
      data: result.payments,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};
