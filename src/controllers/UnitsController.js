import { updateUnitsCount } from '../dataAccess/satation.dataAccess.js';
import { getStationById } from '../sevrices/StationService.js';
import {
  createUnits,
  deleteUnits,
  getAllUnit,
  getUnitById,
  UpdateUnits,
} from '../sevrices/UnitServices.js';
import APIError from '../utils/apiError.js';

export const createUnit = async (req, res, next) => {
  try {
    const { name, stationId, unitType, pricePerHour, status, lastMaintenance } = req.body;

    const station = await getStationById(stationId);
    if (!station) {
      throw new APIError('Station not found', 404);
    }

    const Unit = await createUnits({
      name,
      stationId,    
      unitType,
      pricePerHour,
      status,
      lastMaintenance,
    });
    station.units.push(Unit._id);
    station.unitsCount = station.units.length; 
    await station.save();
    await updateUnitsCount(stationId, 1);

    res.status(201).json({
      status: 'success',
      data: Unit,
    });
  } catch (err) {
    next(err);
  }
};

export const getUnitsById = async (req, res, next) => {
  try {
    const Unit = await getUnitById(req.params.id);
    if (!Unit) return res.status(404).json({ error: 'The unit not found' });
    res.json(Unit);
  } catch (err) {
    next(err);
  }
};

export const getAllUnits = async (req, res, next) => {
  try {
    const Unit = await getAllUnit();
    res.json(Unit);
  } catch (err) {
    next(err);
  }
};

export const UpdateUnit = async (req, res, next) => {
  try {
    const { value } = req.body;
    if (value) return res.status(400).json({ error: error.details[0].message });

    const Unit = await UpdateUnits(req.params.id, value);
    if (!Unit) return res.status(404).json({ error: 'The unit not found' });

    res.json(Unit);
  } catch (err) {
    next(err);
  }
};

export const deleteUnit = async (req, res, next) => {
  try {
    const Unit = await deleteUnits(req.params.id);
    if (!Unit) return res.status(404).json({ error: 'The unit not found' });
    res.json({ message: 'Unit deleted successfully' });
  } catch (err) {
    next(err);
  }
};
