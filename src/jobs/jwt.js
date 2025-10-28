export const define = (agenda) => {
  agenda.define('cleanup expired tokens', async () => {
    try {
      console.log('🧹 Cleaning expired JWT tokens...');
      // Add your token cleanup logic here
      console.log('✅ Token cleanup completed');
    } catch (err) {
      console.error('❌ JWT cleanup failed:', err.message);
      throw err;
    }
  });
};