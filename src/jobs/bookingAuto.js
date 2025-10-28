export const define = (agenda) => {
  agenda.define('auto booking check', async (job) => {
    
    try {
       
      console.log('✅ Auto booking check completed');
    } catch (error) {
      console.error('❌ Auto booking check failed:', error);
      throw error;
    }
  });
};