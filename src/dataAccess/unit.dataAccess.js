import Units from '../models/UnitsModels.js';

export const createUnit = async (dataUnit) => {
  const Unit = new Units(dataUnit);
  return await Unit.save();
};

export const findUnitById = async (id) => {
  return await Units.findById(id);
};

export const findUnitsByStation = async (stationId) => {
  return await Units.find({ station: stationId });
};

export const updateUnit = async (id, updateData) => {
  return await Units.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteUnit = async (id) => {
  return await Units.findByIdAndDelete(id);
};

export const getAllUnits = async () => {
  return await Units.find({});
};
