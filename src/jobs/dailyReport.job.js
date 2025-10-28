import { sendDailyReport } from '../sevrices/ReportsServices.js';

export default (agenda) => {
  agenda.define('generate daily report', async (job) => {
    const today = new Date();
    console.log('  Running Daily Report Job for:', today.toDateString());
    try {
      await sendDailyReport(today);
      console.log('  Daily report email sent successfully');
    } catch (err) {
      console.error('  Error generating/sending daily report:', err.message);
    }
  });

   
};


