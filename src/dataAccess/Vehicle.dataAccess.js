import Vehicles from "../models/VehiclesModels.js";


export const addVehicles = async (dataVehicles) => {
  const Vehicle = new Vehicles(dataVehicles);
  return await Vehicle.save();
};

export const findVehicleById = async (id) => {
    return await Vehicles.findById(id)
    .populate('UserId', 'name email -_id');
};

export const updateUnitsCount = async (VehicleId, change) => {
  return await Vehicles.findByIdAndUpdate( VehicleId , change, { new: true, runValidators: true });
};

export const updateVehicles = async (id, updateData) => {
  return await Vehicles.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteVehicles = async (id) => {
  return await Vehicles.findByIdAndDelete(id);
};

export const getAllVehicles = async () => {
  return await Vehicles.find({});
};

 
