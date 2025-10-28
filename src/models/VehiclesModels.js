import mongoose from 'mongoose';

const VehiclesModels = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    name: { type: String, required: true },
    type: { type: String, required: true },
    powerKW: { type: Number, required: true },
    status: {
      type: String,
      enum: ['empty', 'in-charging', 'full'],
      default: 'empty',
    },
  },
  { timestamps: true }
);

const Vehicles = mongoose.model('Vehicles', VehiclesModels);

export default Vehicles;
