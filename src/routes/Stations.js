import express from 'express';
import {
  StationById,
  AllStations,
  createstation,
  updateStations,
  deleteStations,
  geoSearchStations,
} from '../controllers/StationsController.js';
import { checkRole, protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', checkRole(['owner', 'superadmin']), createstation);
router.get('/:id', checkRole(['driver', 'owner', 'superadmin']), StationById);
router.get('/', checkRole(['driver', 'owner', 'superadmin']), AllStations);
router.put('/:id', checkRole(['owner', 'superadmin']), updateStations);
router.delete('/:id', checkRole(['superadmin']), deleteStations);
router.get(
  '/search/geo',
  checkRole(['driver', 'owner', 'superadmin']),
  geoSearchStations
);

export default router;
