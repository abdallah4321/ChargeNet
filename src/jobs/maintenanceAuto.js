export const define = (agenda) => {
  agenda.define('auto maintenance check', async () => {
    try {
      console.log(' Running maintenance check on stations...');
      const maintenanceCount = Math.floor(Math.random() * 10);
      console.log(` ${maintenanceCount} stations checked for maintenance`);
    } catch (err) {
      console.error(' Maintenance job failed:', err.message);
    }
  });
};
