import Agenda from 'agenda';
import dotenv from 'dotenv';

dotenv.config();

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: 'agendaJobs',
  },
  processEvery: '1 minute',
  maxConcurrency: 20,
  defaultConcurrency: 5,
  lockLimit: 0,
  defaultLockLifetime: 10 * 60 * 1000, // 10 minutes
});

agenda.on('ready', () => console.log('  Agenda connected to MongoDB'));
agenda.on('error', (err) => console.error('  Agenda connection error:', err));

export { agenda };