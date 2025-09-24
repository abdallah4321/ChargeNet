import express from 'express';
import authRoutes from './auth.js';
import stationRoutes from './Stations.js';
import userRoutes from './Users.js';
import unitRoutes from './Units.js';
import vehicleRoutes from './Vehicles.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/stations', stationRoutes);
router.use('/Users', userRoutes);
router.use('/units', unitRoutes);
router.use('/vehicles', vehicleRoutes);
export default router;
