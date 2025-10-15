import Booking from '../models/BookingModels.js';
import Users from '../models/UsersModels.js';
import Stations from '../models/StationsModels.js';
import Units from '../models/UnitsModels.js';
import mongoose from 'mongoose';

export const getDailyBookingStats = async (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  console.log('Start:', start, 'End:', end);

  const results = await Booking.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  return results;
};



export const getMonthlyBookingStats = async (year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  return await Booking.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
};

export const getStationUsageReport = async () => {
  return await Booking.aggregate([
    {
      $lookup: {
        from: 'payments',
        localField: 'payment',
        foreignField: '_id',
        as: 'paymentInfo',
      },
    },
    {
      $lookup: {
        from: 'stations',
        localField: 'unit',
        foreignField: 'units',
        as: 'stationInfo',
      },
    },
    { $unwind: '$stationInfo' },
    {
      $group: {
        _id: '$stationInfo._id',
        stationName: { $first: '$stationInfo.name' },
        totalBookings: { $sum: 1 },
       totalRevenue: { $sum: { $ifNull: [{ $arrayElemAt: ['$paymentInfo.amount', 0] }, 0] } },
      },
    },
  ]);
};

export const getSystemSummary = async () => {
  const totalUsers = await Users.countDocuments();
    const totalUnits = await Units.countDocuments();
  const totalStations = await Stations.countDocuments();
  const activeBookings = await Booking.countDocuments({ status: 'confirmed' });

  return { totalUsers, totalStations, totalUnits , activeBookings  };
};

export const getUserActivityReport = async () => {
  return await Users.aggregate([
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'user',
        as: 'bookings',
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        totalBookings: { $size: '$bookings' },
        lastBooking: { $max: '$bookings.createdAt' },
      },
    },
    { $sort: { totalBookings: -1 } },
  ]);
};
export const getTopStationsReport = async (limit = 5) => {
  return await Booking.aggregate([
    {
      $lookup: {
        from: 'stations',
        localField: 'unit',
        foreignField: 'units',
        as: 'stationInfo',
      },
    },
    { $unwind: '$stationInfo' },
    {
      $group: {
        _id: '$stationInfo._id',
        stationName: { $first: '$stationInfo.name' },
        totalBookings: { $sum: 1 },
      },
    },
    { $sort: { totalBookings: -1 } },
    { $limit: limit },
  ]);
};

export const getRevenueReport = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59);
  return await Booking.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    {
      $lookup: { 
        from: 'payments',
        localField: 'payment',
        foreignField: '_id',
        as: 'paymentInfo',
      },
    },
    { $unwind: '$paymentInfo' },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$paymentInfo.amount' },
        averageRevenue: { $avg: '$paymentInfo.amount' },
        bookingCount: { $sum: 1 },
      },
    },
  ]);
};

export const getLastThreeBookings = async () => {
  return await Booking.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('user')
    .populate('unit')
    .populate('payment');
};

export const getWeeklyBookingReport = async (startDate, endDate) => {
  const now = new Date();

   const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

   const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

   const summary = await Booking.aggregate([
    { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

   const agenda = await Booking.aggregate([
    { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
    {
      $group: {
        _id: {
          day: { $dayOfWeek: '$createdAt' },
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
        totalBookings: { $sum: 1 },
      },
    },
    { $sort: { '_id.date': 1 } },
  ]);

   const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const agendaFormatted = agenda.map((a) => ({
    day: dayNames[a._id.day - 1],
    date: a._id.date,
    totalBookings: a.totalBookings,
  }));

  return { summary, agenda: agendaFormatted };
};

export const getBookingReportByUser = async (userId) => {
  return await Booking.find({ user: userId })
    .populate('unit')
    .populate('payment')
    .sort({ createdAt: -1 });
};

export const getBookingReportByStation = async (stationId) => {
  return await Booking.aggregate([
    {
      $lookup: {
        from: 'units',
        localField: 'unit',
        foreignField: '_id',
        as: 'unitInfo',
      },
    },
    { $unwind: '$unitInfo' },
    { $match: { 'unitInfo.stationId': new mongoose.Types.ObjectId(stationId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
};

export const getRevenueReportByStation = async (
  stationId,
  startDate,
  endDate
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59);
  return await Booking.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    {
      $lookup: {
        from: 'units',
        localField: 'unit',
        foreignField: '_id',
        as: 'unitInfo',
      },
    },
    { $unwind: '$unitInfo' },
    { $match: { 'unitInfo.station': stationId } },
    {
      $lookup: {
        from: 'payments',
        localField: 'payment',
        foreignField: '_id',
        as: 'paymentInfo',
      },
    },
    { $unwind: '$paymentInfo' },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$paymentInfo.amount' },
        averageRevenue: { $avg: '$paymentInfo.amount' },
        bookingCount: { $sum: 1 },
      },
    },
  ]);
};

export const getTopStationsReportByRevenue = async (limit = 5) => {
  return await Booking.aggregate([
    {
      $lookup: {
        from: 'units',
        localField: 'unit',
        foreignField: '_id',
        as: 'unitInfo',
      },
    },
    { $unwind: '$unitInfo' },
    {
      $lookup: {
        from: 'stations',
        localField: 'unitInfo.stationId',
        foreignField: '_id',
        as: 'stationInfo',
      },
    },
    { $unwind: '$stationInfo' },
    {
      $lookup: {
        from: 'payments',
        localField: 'payment',
        foreignField: '_id',
        as: 'paymentInfo',
      },
    },
    { $unwind: '$paymentInfo' },
    {
      $group: {
        _id: '$stationInfo._id',
        stationName: { $first: '$stationInfo.name' },
        totalRevenue: { $sum: '$paymentInfo.amount' },
        bookingCount: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: limit },
  ]);
};
