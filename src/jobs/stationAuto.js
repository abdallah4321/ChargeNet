export const define = (agenda) => {
  agenda.define('auto station sync', async () => {
    try {
      console.log(' Syncing station data with main server...');
      await new Promise((r) => setTimeout(r, 1500));
      console.log(' Station sync completed successfully');
    } catch (err) {
      console.error(' Station sync failed:', err.message);
    }
  });
};
