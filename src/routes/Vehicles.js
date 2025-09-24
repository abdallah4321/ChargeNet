import express from 'express';

const router = express.Router();
import { checkRole, protect } from '../middleware/auth.js';
import {
  validateBody,
  validateParam,
} from '../middleware/validateMiddleware.js';
import { crerateVehicleSchema, idParamSchema, updateVehicleSchema } from '../validators/VehiclesValidations.js';
import { createVehicle, deleteVehicle, getAllVehicle, getVehicleById, updateVehicle } from '../controllers/VehiclesControllers.js';
router.use(protect);

router.post(
  '/',
  checkRole(['driver','owner', 'superadmin']),
  validateBody(crerateVehicleSchema),
createVehicle
);
router.get(
  '/:id',
  checkRole(['driver', 'owner', 'superadmin']),
  validateParam(idParamSchema),
  getVehicleById
);
router.get('/', checkRole(['driver', 'owner', 'superadmin']), getAllVehicle);
router.put(
  '/:id',
  checkRole(['owner', 'superadmin']),
  validateBody(updateVehicleSchema),
  updateVehicle
);
router.delete(
  '/:id',
  checkRole(['owner', 'superadmin']),
  validateParam(idParamSchema),
  deleteVehicle
);

export default router;
