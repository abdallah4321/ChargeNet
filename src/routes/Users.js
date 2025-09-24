import express from 'express';
import {
  createUser,
  deletedUser,
  getAllUsers,
  getByEmail,
  getById,
  updateUser,
} from '../controllers/UsersControllers.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  idParamSchema,
  validateBody,
  validateParam,
  validateQuery,
} from '../middleware/validateMiddleware.js';
import {
  findEmailQuerySchema,
  registerSchema,
  updateUserSchema,
} from '../validators/UserValidations.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('superadmin', 'admin'),
  validateBody(registerSchema),
  createUser
);
router.get(
  '/find-email/',
  protect,
  validateQuery(findEmailQuerySchema),
  getByEmail
);
router.get('/', protect, authorize('superadmin', 'admin'), getAllUsers);
router
  .route('/:id')
  .get(protect, getById)
  .put(
    protect,
    authorize('superadmin', 'admin'),
    validateBody(updateUserSchema),
    updateUser
  )
  .delete(
    protect,
    authorize('superadmin'),
    validateParam(idParamSchema),
    deletedUser
  );

export default router;
