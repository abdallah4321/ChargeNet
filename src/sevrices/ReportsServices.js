import {
  getBookingReportByStation,
  getBookingReportByUser,
  getDailyBookingStats,
  getLastThreeBookings,
  getMonthlyBookingStats,
  getRevenueReport,
  getRevenueReportByStation,
  getStationUsageReport,
  getSystemSummary,
  getTopStationsReport,
  getTopStationsReportByRevenue,
  getUserActivityReport,
  getWeeklyBookingReport,
} from '../dataAccess/Reports.dataAccess.js';
import sendEmail from '../utils/sendEmail.js';

export const generateDailyReport = async (date) => {
  return await getDailyBookingStats(date);
};

export const generateMonthlyReport = async (year, month) => {
  return await getMonthlyBookingStats(year, month);
};

export const generateStationReport = async () => {
  return await getStationUsageReport();
};

export const generateSystemSummary = async () => {
  return await getSystemSummary();
};

export const generateUserActivityReport = async () => {
  return await getUserActivityReport();
};

export const generateTopStationsReport = async () => {
  return await getTopStationsReport();
};

export const generateRevenueReport = async (startDate, endDate) => {
  return await getRevenueReport(startDate, endDate);
};

export const generateAnnualReport = async (year) => {
  const monthlyReports = [];
  for (let month = 1; month <= 12; month++) {
    const report = await getMonthlyBookingStats(year, month);
    monthlyReports.push({ month, report });
  }
  return monthlyReports;
};

export const getRecentBookings = async () => {
  return await getLastThreeBookings();
};

 export const generateWeeklyBookingStats = async () => {
  const now = new Date();

   const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

   const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

   return await getWeeklyBookingReport(startOfWeek, endOfWeek);
};

export const generateBookingReportByUser = async (userId) => {
  return await getBookingReportByUser(userId);
};

export const generateBookingReportByStation = async (stationId) => {
  return await getBookingReportByStation(stationId);
};


export const generateRevenueReportByStation = async (
  stationId,
  startDate,
  endDate
) => {
  return await getRevenueReportByStation(stationId, startDate, endDate);
};

export const generateTopStationsReportByRevenue = async (
  startDate,
  endDate
) => {
  return await getTopStationsReportByRevenue(startDate, endDate);
};



 export const sendDailyReport = async (date = new Date()) => {
  const reportData = await getDailyBookingStats(date);
  await sendDailyReportEmail(reportData, date);
  return reportData;
};

const sendDailyReportEmail = async (reportData, date) => {
  const formattedDate = date.toISOString().split('T')[0];

  const htmlRows = reportData.map(
    (r) => `<tr><td>${r.status}</td><td>${r.count}</td></tr>`
  ).join('');

  const html = `
    <h2>📅 Daily Booking Report - ${formattedDate}</h2>
    <p>Here is the booking summary for ${formattedDate}:</p>
    <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
      <thead>
        <tr><th>Status</th><th>Count</th></tr>
      </thead>
      <tbody>${htmlRows}</tbody>
    </table>
    <br/>
    <p>Regards,<br/>ARS Valley System</p>
  `;

  await sendEmail({
    to: 'makkalanagesh143@gmail.com',
    subject: `Daily Report - ${formattedDate}`,
    text: `Daily Booking Report for ${formattedDate}`,
    html,
  });

  console.log('✅ Daily report email sent successfully');
};