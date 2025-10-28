import { agenda } from '../config/agendaConfig.js';
import APIError from '../utils/apiError.js';

export const scheduleRecurringTasks = async () => {
  try {
    // Daily report at 9 AM
    await agenda.every('*/1 * * * *', 'generate daily report');
    // Monthly report on 1st of month at 9 AM
    await agenda.every('0 9 1 * *', 'chargeReminderEmail');

    // Check pending payments every 10 minutes
    await agenda.every('10 minutes', 'check pending payments');

    // Station status check every 15 minutes
    await agenda.every('15 minutes', 'auto station status check');

    // Booking check every 30 minutes
    await agenda.every('30 minutes', 'auto booking check');

    // Maintenance check daily at 3 AM
    await agenda.every('0 3 * * *', 'auto maintenance check');

    // Cleanup expired tokens daily at 4 AM
    await agenda.every('0 4 * * *', 'cleanup expired tokens');
    
    // Daily notification email at 8 AM
    await agenda.every('0 8 * * *', 'send notification email', {
      to: 'makkalanagesh143@gmail.com',
      subject: 'Daily System Health Report',
      text: 'System check completed successfully',
    });
  } catch (error) {
    throw new APIError(`Error scheduling recurring tasks: ${error.message}`, 500);
  }
};