import Stations from '../models/StationsModels.js';

export const createStations = async (dataStation) => {
  const station = new Stations(dataStation);
  return await station.save();
};

export const findStationById = async (id) => {
  return await Stations.findById(id)
    .populate('ownerId', 'name email')
    .populate('units', 'name unitType status pricePerHour'); 
};

export const updateStation = async (id, updateData) => {
  return await Stations.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('ownerId', 'name email')
    .populate('Unit', 'type status');
};

export const deleteStation = async (id) => {
  return await Stations.findByIdAndDelete(id);
};

export const getAllStation = async () => {
  return await Stations.find({})
    .populate('ownerId', 'name email')
    .populate('Unit', 'type status');
};

export const geoSearchStations = async (lng, lat, radius) => {
  return await Stations.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius / 6378.1] }, // radius بالكيلومتر
    },
  });
};
