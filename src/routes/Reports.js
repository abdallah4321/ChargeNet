import express from 'express';
import { checkRole, protect } from '../middleware/auth.js';
import {
  getAnnualReport,
  getBookingReportByStation,
  getBookingReportByUser,
  getDailyReport,
  getMonthlyReport,
  getRecentBookings,
  getRevenueReport,
  getRevenueReportByStation,
  getStationReport,
  getSystemSummary,
  getTopStationsReport,
  getTopStationsReportByRevenue,
  getUserActivityReport,
  getWeeklyBookingStats,
} from '../controllers/ReportsController.js';

const router = express.Router();

router.get('/daily-bookings', protect, checkRole('superadmin'), getDailyReport);
router.get(
  '/monthly-bookings',
  protect,
  checkRole('superadmin'),
  getMonthlyReport
);
router.get(
  '/station-usage',
  protect,
  checkRole('superadmin'),
  getStationReport
);
router.get(
  '/system-summary',
  protect,
  checkRole('superadmin'),
  getSystemSummary
);
router.get(
  '/user-activity',
  protect,
  checkRole('superadmin'),
  getUserActivityReport
);
router.get(
  '/top-stations',
  protect,
  checkRole('superadmin'),
  getTopStationsReport
);
router.get('/revenue', protect, checkRole('superadmin'), getRevenueReport);
router.get('/annual', protect, checkRole('superadmin'), getAnnualReport);
router.get(
  '/recent-bookings',
  protect,
  checkRole('superadmin'),
  getRecentBookings
);

router.get(
  '/weekly-stats',
  protect,
  checkRole('superadmin'),
  getWeeklyBookingStats
);
router.get(
  '/booking-by-user',
  protect,
  checkRole('superadmin'),
  getBookingReportByUser
);
router.get(
  '/booking-by-station',
  protect,
  checkRole('superadmin'),
  getBookingReportByStation
);
router.get(
  '/revenue-by-station/:id',
  protect,
  checkRole('superadmin'),
  getRevenueReportByStation
);
router.get(
  '/top-stations-revenue',
  protect,
  checkRole('superadmin'),
  getTopStationsReportByRevenue
);



export default router;
