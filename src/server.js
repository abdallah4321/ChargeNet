import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import agendaManager from './utils/Agenda.js'; // شيل    
import { agenda } from './config/agendaConfig.js';
dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    console.log('  Database connected successfully');

    await agendaManager.initialize();  
    console.log('  Agenda scheduler started');  

    app.listen(PORT, () => {
      console.log(`  Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('  Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received - shutting down gracefully');
  await agendaManager.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received - shutting down gracefully');
  await agendaManager.stop();
  process.exit(0);
});

startServer();
