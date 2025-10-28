import { agenda } from '../config/agendaConfig.js';
import { sendDailyReport } from '../sevrices/ReportsServices.js';
import agendaManager from '../utils/Agenda.js';

export const testAgenda = async () => {
  console.log('  Testing report function directly...');
  const start = new Date();
  start.setHours(21, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  end.setMilliseconds(-1);

  console.log('Start:', start.toISOString(), 'End:', end.toISOString());

  try { 
    await sendDailyReport(new Date());

    console.log('🔧 Running job manually...');
    await agenda.now('generate daily report');  
  } catch (error) {
    console.error('  Test failed:', error);
  }
};
testAgenda();