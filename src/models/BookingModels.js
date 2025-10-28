import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Users',
      required: true 
    },
    vehicle: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Vehicles',
      required: true 
    },
    unit: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Units',
      required: true 
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payments',
      default: null,
    },
    amount: { 
      type: Number, 
      required: true 
    },  
    startTime: { 
      type: Date, 
      required: true 
    },
    endTime: { 
      type: Date, 
      required: true 
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    cancelledAt: {
      type: Date
    },
    actualStartTime: {
      type: Date
    },
    actualEndTime: {
      type: Date
    }
  },
  { timestamps: true }
);

// Indexes for better performance
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ unit: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ status: 1 });

// Virtual for duration
bookingSchema.virtual('durationHours').get(function() {
  return (this.endTime - this.startTime) / (1000 * 60 * 60);
});

const Booking = mongoose.model('Bookings', bookingSchema);
export default Booking;