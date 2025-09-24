import {
  createUnit,
  deleteUnit,
  findUnitById,
  getAllUnits,
  updateUnit,
} from '../dataAccess/unit.dataAccess.js';

export const createUnits = async (data) => {
  return await createUnit(data);
};

export const getUnitById = async (id) => {
  return await findUnitById(id);
};

export const getAllUnit = async () => {
  return await getAllUnits();
};

export const UpdateUnits = async (id, data) => {
  return await updateUnit(id, data);
};

export const deleteUnits = async (id) => {
  return await deleteUnit(id);
};
