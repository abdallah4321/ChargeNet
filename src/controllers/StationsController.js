import {
  createStation,
  getStationById,
  getAllStations,
  UpdateStation,
  DeleteStation,
  geoSearchService,
} from '../sevrices/StationService.js';
import {
  createStationSchema,
  updateStationSchema,
} from '../validators/StationsValidations.js';

export const createstation = async (req, res, next) => {
  try {
    const { error, value } = createStationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const station = await createStation(value);
    res.status(201).json(station);
  } catch (err) {
    next(err);
  }
};

export const StationById = async (req, res, next) => {
  try {
    const station = await getStationById(req.params.id);
    if (!station) return res.status(404).json({ error: 'Station not found' });
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
    const { error, value } = updateStationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

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
