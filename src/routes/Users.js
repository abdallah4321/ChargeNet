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
import { validate } from '../middleware/validateMiddleware.js';
import { registerSchema, updateUserSchema } from '../validators/UserValidations.js';

const router = express.Router();

router.post('/', protect, authorize('superadmin', 'admin'),validate(registerSchema), createUser);
router.get('/find-email/', protect, getByEmail);
router.get('/', protect, authorize('superadmin', 'admin'), getAllUsers);
router
  .route('/:id')
  .get(protect, getById)
  .put(protect, authorize('superadmin', 'admin'),validate(updateUserSchema),updateUser)
  .delete(protect, authorize('superadmin'), deletedUser);

export default router;
