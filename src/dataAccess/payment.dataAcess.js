import Payment from '../models/PaymentModels.js';
import APIError from "../utils/apiError.js";

export const createPayment = async (data) => {
  try {
    return await Payment.create(data);
  } catch (error) {
    throw new APIError(`Error creating payment: ${error.message}`, 500);
  }
};

export const findPaymentByOrderId = async (orderId) => {
  try {
    const payment = await Payment.findOne({ paymobOrderId: orderId })
      .populate('userId', 'name email')
      .populate('bookingId');
    
    if (!payment) {
      throw new APIError("Payment not found", 404);
    }
    return payment;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(`Error finding payment: ${error.message}`, 500);
  }
};

export const findPaymentById = async (id) => {
  try {
    const payment = await Payment.findById(id)
      .populate('userId', 'name email')
      .populate('bookingId');
    
    if (!payment) {
      throw new APIError("Payment not found", 404);
    }
    return payment;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(`Error finding payment: ${error.message}`, 500);
  }
};

export const getAllPayments = async (filters = {}) => {
  try {
    const { status, userId, page = 1, limit = 10 } = filters;
    
    const query = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;

    const skip = (page - 1) * limit;

    const payments = await Payment.find(query)
      .populate('userId', 'name email')
      .populate('bookingId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(query);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new APIError(`Error fetching payments: ${error.message}`, 500);
  }
};

export const updatePaymentByOrderId = async (orderId, data) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { paymobOrderId: orderId }, 
      data, 
      { 
        new: true,
        runValidators: true 
      }
    ).populate('userId', 'name email').populate('bookingId');

    if (!payment) {
      throw new APIError("Payment not found", 404);
    }
    return payment;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(`Error updating payment: ${error.message}`, 500);
  }
};