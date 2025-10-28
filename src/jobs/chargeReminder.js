import { agenda } from '../config/agendaConfig.js';
import APIError from '../utils/apiError.js';
import sendEmail from '../utils/sendEmail.js';

export const define = (agenda) => {
  agenda.define('chargeReminderEmail', async (job) => {
    const { email, chargeTime, location, userName, bookingId } = job.attrs.data;
    
    console.log(` Sending charge reminder email to ${email}...`);

    try {
      const subject = ' Charging Session Reminder - ChargeNet';
      const formattedTime = new Date(chargeTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const text = `Hello ${userName}, you have a charging session at ${formattedTime} at ${location}.`;
      
      const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #2E86AB, #A23B72); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">⚡ ChargeNet</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Charging Session Reminder</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #2E86AB; margin-bottom: 20px;">Hello ${userName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              This is a reminder for your upcoming electric vehicle charging session:
            </p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2E86AB;">
              <p style="margin: 5px 0; font-size: 16px;">
                <strong>⏰ Time:</strong> ${formattedTime}
              </p>
              <p style="margin: 5px 0; font-size: 16px;">
                <strong>📍 Location:</strong> ${location}
              </p>
              <p style="margin: 5px 0; font-size: 16px;">
                <strong>🆔 Booking ID:</strong> ${bookingId}
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Please arrive on time to avoid automatic cancellation of your booking.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #2E86AB; color: white; padding: 12px 30px; border-radius: 25px; display: inline-block; font-weight: bold;">
                Thank you for choosing ChargeNet ⚡
              </div>
            </div>
          </div>
          
          <div style="border-top: 2px solid #e0e0e0; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">
              Electric Vehicle Charging Station Booking System<br>
              <a href="mailto:support@chargenet.com" style="color: #2E86AB; text-decoration: none;">support@chargenet.com</a>
            </p>
          </div>
        </div>
      `;

      await sendEmail(email, subject, null, text, html);
      console.log(` Charge reminder sent to ${email}`);
      
    } catch (err) {
      console.error(` Error sending charge reminder to ${email}:`, err.message);
      throw new APIError(`Error sending charge reminder: ${err.message}`, 500);
    }
  });
};

// Function to schedule charge reminder
export const scheduleChargeReminder = async (bookingData) => {
  try {
    const { userEmail, userName, chargeTime, stationName, stationLocation, bookingId } = bookingData;
    
    // Calculate reminder time (20 minutes before charge time)
    const reminderTime = new Date(chargeTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - 20);
    
    const location = `${stationName} - ${stationLocation}`;

    const job = await agenda.schedule(reminderTime, 'chargeReminderEmail', {
      email: userEmail,
      userName: userName,
      chargeTime: chargeTime,
      location: location,
      bookingId: bookingId
    });

    console.log(` Charge reminder scheduled for ${userEmail} at ${reminderTime}`);
    return job;
    
  } catch (error) {
    console.error(' Error scheduling charge reminder:', error.message);
    throw new APIError(`Error scheduling charge reminder: ${error.message}`, 500);
  }
};

// Function to cancel charge reminder
export const cancelChargeReminder = async (bookingId) => {
  try {
    const jobs = await agenda.jobs({
      'data.bookingId': bookingId,
      name: 'chargeReminderEmail'
    });

    let cancelledCount = 0;
    for (const job of jobs) {
      await job.remove();
      cancelledCount++;
    }

    if (cancelledCount > 0) {
      console.log(` Cancelled ${cancelledCount} charge reminder(s) for booking ${bookingId}`);
    }
    
    return cancelledCount;
  } catch (error) {
    console.error(' Error cancelling charge reminder:', error.message);
    throw new APIError(`Error cancelling charge reminder: ${error.message}`, 500);
  }
};