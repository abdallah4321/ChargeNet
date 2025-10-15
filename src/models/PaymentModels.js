import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    BookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookings' },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Paymob' },
    currency: { type: String, default: 'EGP' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionRef: { type: String, default: null },
    orderId: { type: String, default: null },  
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payments', PaymentSchema);
export default Payment;
