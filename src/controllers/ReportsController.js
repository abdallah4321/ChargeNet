import * as reportService from '../sevrices/ReportsServices.js';

export const getDailyReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await reportService.generateDailyReport(startDate, endDate);
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

export const getMonthlyReport = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const report = await reportService.generateMonthlyReport(year, month);
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

export const getStationReport = async (req, res, next) => {
  try {
    const report = await reportService.generateStationReport();
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

export const getSystemSummary = async (req, res, next) => {
  try {
    const summary = await reportService.generateSystemSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
};

export const getUserActivityReport = async (req, res, next) => {
  try {
    const report = await reportService.generateUserActivityReport();
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

export const getTopStationsReport = async (req, res, next) => {
  try {
    const report = await reportService.generateTopStationsReport();
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

export const getRevenueReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await reportService.generateRevenueReport(
      startDate,
      endDate
    );
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

export const getAnnualReport = async (req, res, next) => {
  try {
    const { year } = req.query;
    const report = await reportService.generateAnnualReport(year);
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

export const getRecentBookings = async (req, res, next) => {
  try {
    const bookings = await reportService.getRecentBookings();
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const getWeeklyBookingStats = async (req, res, next) => {
  try {
    const stats = await reportService.generateWeeklyBookingStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
export const getBookingReportByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const report = await reportService.generateBookingReportByUser(userId);
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

export const getBookingReportByStation = async (req, res, next) => {
  try {
    const { stationId } = req.query;
    console.log('StationId:', stationId);

    const report = await reportService.generateBookingReportByStation(stationId);
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};
export const getRevenueReportByStation = async (req, res, next) => {
  try {
    const { stationId } = req.params;
    const { startDate, endDate } = req.query;
    const report = await reportService.generateRevenueReportByStation(
      stationId,
      startDate,
      endDate
    );
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

export const getTopStationsReportByRevenue = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await reportService.generateTopStationsReportByRevenue(
      startDate,
      endDate
    );
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};
