import {
  createStations,
  deleteStation,
  findStationById,
  geoSearchStations,
  getAllStation,
  updateStation,
} from '../dataAccess/satation.dataAccess.js';

export const createStation = async (data) => {
  return await createStations(data);
};

export const getStationById = async (id) => {
  return await findStationById(id)
  
};

export const getAllStations = async () => {
  return await getAllStation();
};

export const UpdateStation = async (id, data) => {
  return await updateStation(id, data);
};

export const DeleteStation = async (id) => {
  return await deleteStation(id);
};

export const geoSearchService = async (lng, lat, radius) => {
  return await geoSearchStations(lng, lat, radius);
};
