 
export const define = (agenda) => {
  agenda.define('generate monthly report', async () => {
    try {
      console.log(` Monthly report generated for ${month}/${year}`);
    } catch (err) {
      console.error(' Error generating monthly report:', err.message);
    }
  });
};
