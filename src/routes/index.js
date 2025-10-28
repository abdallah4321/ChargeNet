import express from 'express';
import authRoutes from './auth.js';
import stationRoutes from './Stations.js';
import userRoutes from './Users.js';
import unitRoutes from './Units.js';
import vehicleRoutes from './Vehicles.js';
import paymentRoutes from './Payment.js';
import bookingRoutes from './Booking.js';
import reportRoutes from './Reports.js';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/stations', stationRoutes);
router.use('/Users', userRoutes);
router.use('/units', unitRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/payment', paymentRoutes);
router.use('/Booking', bookingRoutes);
router.use('/reports', reportRoutes);
                                                                                                                                                                                                                                                        
export default router;
