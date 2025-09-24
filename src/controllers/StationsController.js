import {
  createStation,
  getStationById,
  getAllStations,
  UpdateStation,
  DeleteStation,
  geoSearchService,
} from '../sevrices/StationService.js';
import APIError from '../utils/apiError.js';
export const addStation = async (req, res, next) => {
  try {
    const station = await createStation(req.body);
    res.status(201).json({ status: 'success', data: station });
  } catch (err) {
    next(err);
  }
};

export const StationById = async (req, res, next) => {
  try {
    const station = await getStationById(req.params.id);
    if (!station) {
      throw new APIError('Station not found', 404);
    }
    res.json(station);
  } catch (err) {
    next(err);
  }
};

export const AllStations = async (req, res, next) => {
  try {
    const stations = await getAllStations();
    res.json(stations);
  } catch (err) {
    next(err);
  }
};

export const updateStations = async (req, res, next) => {
  try {
    const { value } = req.body;
    const station = await UpdateStation(req.params.id, value);
    if (!station) return res.status(404).json({ error: 'Station not found' });

    res.json(station);
  } catch (err) {
    next(err);
  }
};

export const deleteStations = async (req, res, next) => {
  try {
    const station = await DeleteStation(req.params.id);
    if (!station) return res.status(404).json({ error: 'Station not found' });
    res.json({ message: 'Station deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const geoSearchStations = async (req, res, next) => {
  try {
    const { lng, lat, radius } = req.query;
    const stations = await geoSearchService(
      parseFloat(lng),
      parseFloat(lat),
      parseFloat(radius)
    );
    res.json(stations);
  } catch (err) {
    next(err);
  }
};
