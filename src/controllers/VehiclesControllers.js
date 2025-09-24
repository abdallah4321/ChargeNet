import {
  addVehicles,
  deleteVehicles,
  findVehicleById,
  getAllVehicles,
  updateVehicles,
} from '../dataAccess/Vehicle.dataAccess.js';
import { getUserById } from '../sevrices/UserServices.js';
import APIError from '../utils/apiError.js';

export const createVehicleByadmins = async (req, res, next) => {
  try {
    const { name, type, powerKW, status, User } = req.body;
    const id = req.user.id;
    const Users = await getUserById(id);
    if (!Users) {
      throw new APIError('user not found', 404);
    }

    const Vehicle = await addVehicles({
      name,
      User,
      type,
      powerKW,
      status,
    });

    res.status(201).json({
      status: 'success',
      data: Vehicle,
    });
  } catch (err) {
    next(err);
  }
};

export const createVehicleByDriver = async (req, res, next) => {
  try {
    const { name, type, powerKW, status } = req.body;
    const User = req.user.id;
    const user = await getUserById(User);
    if (!user) {
      throw new APIError('user not found', 404);
    }

    const Vehicle = await addVehicles({
      name,
      User,
      type,
      powerKW,
      status,
    });

    res.status(201).json({
      status: 'success',
      data: Vehicle,
    });
  } catch (err) {
    next(err);
  }
};

export const getVehicleById = async (req, res, next) => {
  try {
    const Vehicle = await findVehicleById(req.body.id);
    if (!Vehicle)
      return res.status(404).json({ error: 'The Vehicle not found' });
    res.json(Vehicle);
  } catch (err) {
    next(err);
  }
};

export const getAllVehicle = async (req, res, next) => {
  try {
    const Vehicle = await getAllVehicles();
    res.json(Vehicle);
  } catch (err) {
    next(err);
  }
};

export const updateVehicle = async (req, res, next) => {
  try {
    const { value } = req.body;
    if (value) return res.status(400).json({ error: error.details[0].message });

    const Vehicle = await updateVehicles(req.params.id, value);
    if (!Vehicle)
      return res.status(404).json({ error: 'The Vehicle not found' });

    res.json(Vehicle);
  } catch (err) {
    next(err);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    const Vehicle = await deleteVehicles(req.params.id);
    if (!Vehicle)
      return res.status(404).json({ error: 'The Vehicle not found' });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    next(err);
  }
};
