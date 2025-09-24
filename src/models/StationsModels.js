import mongoose from 'mongoose';

const StationsSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    stationImg: { type: String },
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    capacity: { type: Number, required: true },
    unitsCount: { type: Number, default: 0 },
    units: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Units' }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

StationsSchema.index({ location: '2dsphere' });

const Stations = mongoose.model('Stations', StationsSchema);

export default Stations;
