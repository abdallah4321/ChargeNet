import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stations from '../models/StationsModels.js';
import Users from '../models/UsersModels.js';
import Units from '../models/UnitsModels.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected...');

    await Stations.deleteMany({});
    await Users.deleteMany({});
    await Units.deleteMany({});

    const owner = await Users.create({
      name: 'Ahmed Ali',
      email: 'ahmed@test.com',
      password: '123456',
      role: 'owner',
    });

    const driver = await Users.create({
      name: 'Mohamed Driver',
      email: 'driver@test.com',
      password: '123456',
      role: 'driver',
    });

    const superAdmin = await Users.create({
      name: 'System Admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'superadmin',
    });

    const station = await Stations.create({
      ownerId: owner._id,
      name: 'Central Station',
      location: {
        type: 'Point',
        coordinates: [31.2357, 30.0444],
      },
      capacity: 20,
      noUnits: 5,
      availableBikes: 15,
      status: 'active',
    });

    const units = await Units.insertMany([
      { stationId: station._id, type: 'charger', status: 'available' },
      { stationId: station._id, type: 'charger', status: 'available' },
      { stationId: station._id, type: 'parking', status: 'occupied' },
    ]);

    station.Unit = units.map((u) => u._id);
    await station.save();

    console.log('Seeding Done!');
    console.log('SuperAdmin:', superAdmin.email, '/', superAdmin.password);
    console.log('Owner:', owner.email, '/', owner.password);
    console.log('Driver:', driver.email, '/', driver.password);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
};

seed();
