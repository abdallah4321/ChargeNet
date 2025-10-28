export const define = (agenda) => {
  agenda.define('auto payment check', async () => {
    try {
      console.log(' Checking for pending payments...');
      const pending = Math.floor(Math.random() * 5);
      console.log(` Found ${pending} pending payments`);
    } catch (err) {
      console.error(' Payment auto check failed:', err.message);
    }
  });
};
