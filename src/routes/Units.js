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
import { validate } from '../middleware/validateMiddleware.js';
import { createUnitsSchema, updateUnitsSchema } from '../validators/UnitsValidations.js';
router.use(protect);

router.post('/', checkRole(['owner', 'superadmin']), validate(createUnitsSchema),createUnit);
router.get('/:id', checkRole(['driver', 'owner', 'superadmin']), getUnitsById);
router.get('/', checkRole(['driver', 'owner', 'superadmin']), getAllUnits);
router.put('/:id', checkRole(['owner', 'superadmin']),validate(updateUnitsSchema), UpdateUnit);
router.delete('/:id', checkRole(['owner', 'superadmin']), deleteUnit);

export default router;
