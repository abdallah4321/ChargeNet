import mongoose from 'mongoose';

const PaymentModels = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionRef: { type: String, unique: true },
  },
  { timestamps: true }
);
const Payment = mongoose.model('Payment', PaymentModels);
export default Payment;
