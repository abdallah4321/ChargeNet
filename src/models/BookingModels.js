import mongoose from 'mongoose';

const BookingModels = new mongoose.Schema(
  {
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    StationsId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stations' },
    UnitsId: { type: mongoose.Schema.Types.ObjectId, ref: 'Units' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'canceled'],
      default: 'pending',
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    energyConsumed: { type: Number, default: 0 }, // in kWh
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', BookingModels);

export default Booking;
