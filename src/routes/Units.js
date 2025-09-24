import express from 'express';

const router = express.Router();
import { checkRole, protect } from '../middleware/auth.js';
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  getUnitsById,
  UpdateUnit,
} from '../controllers/UnitsController.js';
import {
  createUnitsSchema,
  idParamSchema,
  updateUnitsSchema,
} from '../validators/UnitsValidations.js';
import {
  validateBody,
  validateParam,
} from '../middleware/validateMiddleware.js';
router.use(protect);

router.post(
  '/',
  checkRole(['owner', 'superadmin']),
  validateBody(createUnitsSchema),
  createUnit
);
router.get(
  '/:id',
  checkRole(['driver', 'owner', 'superadmin']),
  validateParam(idParamSchema),
  getUnitsById
);
router.get('/', checkRole(['driver', 'owner', 'superadmin']), getAllUnits);
router.put(
  '/:id',
  checkRole(['owner', 'superadmin']),
  validateBody(updateUnitsSchema),
  UpdateUnit
);
router.delete(
  '/:id',
  checkRole(['owner', 'superadmin']),
  validateParam(idParamSchema),
  deleteUnit
);

export default router;
