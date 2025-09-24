import express from 'express';
import {
  StationById,
  AllStations,
  updateStations,
  deleteStations,
  geoSearchStations,
  addStation,
} from '../controllers/StationsController.js';
import { checkRole, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createStationSchema, updateStationSchema } from '../validators/StationsValidations.js';

const router = express.Router();

router.use(protect);

router.post('/', checkRole(['owner', 'superadmin']),validate(createStationSchema), addStation);
router.get('/:id', checkRole(['driver', 'owner', 'superadmin']), StationById);
router.get('/', checkRole(['driver', 'owner', 'superadmin']), AllStations);
router.put('/:id', checkRole(['owner', 'superadmin']),validate(updateStationSchema), updateStations);
router.delete('/:id', checkRole(['superadmin']), deleteStations);
router.get(
  '/search/geo',
  checkRole(['driver', 'owner', 'superadmin']),
  geoSearchStations
);

export default router;
