import express from 'express';

const router = express.Router();
import { checkRole, protect } from '../middleware/auth.js';
import {
  idParamSchema,
  validateBody,
  validateParam,
} from '../middleware/validateMiddleware.js';
import {
  crerateVehicleByAdminSchema,
  updateVehicleSchema,
} from '../validators/VehiclesValidations.js';
import {
  createVehicleByadmins,
  createVehicleByDriver,
  deleteVehicle,
  getAllVehicle,
  getVehicleById,
  updateVehicle,
} from '../controllers/VehiclesControllers.js';
router.use(protect);

router.post(
  '/',
  protect,
  checkRole(['owner', 'superadmin']),
  validateBody(crerateVehicleByAdminSchema),
  createVehicleByadmins
);

router.post('/driver/', protect, checkRole(['Driver']), createVehicleByDriver);

router.get(
  '/:id',
  protect,
  checkRole(['Driver', 'owner', 'superadmin']),
  validateParam(idParamSchema),
  getVehicleById
);
router.get(
  '/',
  protect,
  checkRole(['Driver', 'owner', 'superadmin']),
  getAllVehicle
);
router.put(
  '/:id',
  protect,
  checkRole(['owner', 'superadmin']),
  validateBody(updateVehicleSchema),
  updateVehicle
);
router.delete(
  '/:id',
  protect,
  checkRole(['owner', 'superadmin']),
  validateParam(idParamSchema),
  deleteVehicle
);

export default router;
