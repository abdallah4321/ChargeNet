import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicles' },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Units' },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payments',
      default: null,
    },
    amount : { type: Number, required: true },  
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Bookings', bookingSchema);
export default Booking;
