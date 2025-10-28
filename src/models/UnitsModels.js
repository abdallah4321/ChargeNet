import mongoose from 'mongoose';

const unitsSchema = new mongoose.Schema(
  {
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stations',
      required: true,
    },
    name: { type: String, required: true },
    unitType: { type: String, required: true },
    status: {
      type: String,
      enum: ['available', 'in-use', 'maintenance'],
      default: 'available',
    },
    pricePerHour: { type: Number, required: true },
    lastMaintenance: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Units = mongoose.model('Units', unitsSchema);

export default Units;
