import Stations from '../models/StationsModels.js';

export const createStations = async (dataStation) => {
  const station = new Stations(dataStation);
  return await station.save();
};

export const findStationById = async (id) => {
    return await Stations.findById(id)
    .populate({
      path: "units", 
      select: "name unitType status pricePerHour lastMaintenance"
    });

};

export const updateUnitsCount = async (stationId, change) => {
  return await Stations.findByIdAndUpdate(
    stationId,
    { $inc: { unitsCount: change } },
    { new: true }
  );
};

export const updateStation = async (id, updateData) => {
  return await Stations.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteStation = async (id) => {
  return await Stations.findByIdAndDelete(id);
};

export const getAllStation = async () => {
  return await Stations.find({});
};

export const geoSearchStations = async (lng, lat, radius) => {
  return await Stations.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius / 6378.1] }, // radius بالكيلومتر
    },
  });
};
