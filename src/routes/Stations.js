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
import {
  validateBody,
  validateParam,
  validateQuery,
} from '../middleware/validateMiddleware.js';
import {
  createStationSchema,
  geoSearchQuerySchema,
  idParamSchema,
  updateStationSchema,
} from '../validators/StationsValidations.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  checkRole(['owner', 'superadmin']),
  validateBody(createStationSchema),
  addStation
);
router.get(
  '/:id',
  checkRole(['driver', 'owner', 'superadmin']),
  validateParam(idParamSchema),
  StationById
);
router.get('/', checkRole(['driver', 'owner', 'superadmin']), AllStations);
router.put(
  '/:id',
  checkRole(['owner', 'superadmin']),
  validateBody(updateStationSchema),
  updateStations
);
router.delete(
  '/:id',
  checkRole(['superadmin']),
  validateParam(idParamSchema),
  deleteStations
);
router.get(
  '/search/geo',
  checkRole(['driver', 'owner', 'superadmin']),
  validateQuery(geoSearchQuerySchema),
  geoSearchStations
);

export default router;
