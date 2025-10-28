import APIError from '../utils/apiError.js';
import sendEmail from '../utils/sendEmail.js';

export const define = (agenda) => {

 agenda.define('chargeReminderEmail', async (job) => {
    const { email, chargeTime, location } = job.attrs.data;
    console.log(`🔔 Sending charge reminder email to ${email}...`);

    try {
      const subject = '⏰ تذكير بموعد الشحن';
      const text = `مرحبًا، لديك موعد شحن الساعة ${chargeTime} في ${location}.`;
      const html = `
        <h3>تذكير بموعد الشحن</h3>
        <p>لديك موعد شحن الساعة <b>${chargeTime}</b> في <b>${location}</b>.</p>
        <p>نراك قريبًا ⚡</p>
      `;

      await sendEmail(email, subject, null, text, html);
    } catch (err) {
     throw new APIError(`  Error sending daily summary email: ${err.message}`, 500);
     }
  });
}


 

    
      
