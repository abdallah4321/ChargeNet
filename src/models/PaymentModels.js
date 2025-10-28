import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Users',
      required: true 
    },
    bookingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Bookings',
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    paymentMethod: { 
      type: String, 
      default: 'Paymob' 
    },
    currency: { 
      type: String, 
      default: 'EGP' 
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionRef: { 
      type: String, 
      default: null 
    },
    paymobOrderId: { 
      type: String, 
      default: null
    },
    iframeUrl: {
      type: String,
      default: null
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for better performance
PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ paymobOrderId: 1 });

const Payment = mongoose.model('Payments', PaymentSchema);
export default Payment;