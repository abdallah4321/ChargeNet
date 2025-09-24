import {
  addVehicles,
  deleteVehicles,
  findVehicleById,
  getAllVehicles,
  updateVehicles,
} from '../dataAccess/Vehicle.dataAccess.js';

export const createVehicles = async (data) => {
  return await addVehicles(data);
};

export const getVehicleById = async (id) => {
  return await findVehicleById(id);
};

export const findAllVehicles = async () => {
  return await getAllVehicles();
};

export const updateVehicle = async (id, data) => {
  return await updateVehicles(id, data);
};

export const deleteVehicle = async (id) => {
  return await deleteVehicles(id);
};
