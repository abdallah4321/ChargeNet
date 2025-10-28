import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { agenda } from '../config/agendaConfig.js';
import APIError from '../utils/apiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AgendaManager {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      console.log('Agenda already initialized');
      return agenda;
    }

    try {
      await this.loadJobDefinitions();

      await agenda.start();
      console.log('ChargeNet Agenda scheduler started');

      await this.scheduleRecurringJobs();

      this.initialized = true;
      return agenda;
    } catch (err) {
      throw new APIError(`Failed to initialize Agenda: ${err.message}`, 500);
    }
  }

  async loadJobDefinitions() {
    const jobsFolderPath = path.join(__dirname, '..', 'jobs');

    if (!fs.existsSync(jobsFolderPath)) {
      console.log(' Creating jobs directory...');
      fs.mkdirSync(jobsFolderPath, { recursive: true });
      return;
    }

    const jobFiles = fs.readdirSync(jobsFolderPath)
      .filter(file => file.endsWith('.js') && !file.startsWith('_'));

    console.log(`Loading ${jobFiles.length} job files...`);

    for (const file of jobFiles) {
      try {
        const jobModule = await import(`file://${path.join(jobsFolderPath, file)}`);
        if (typeof jobModule.define === 'function') {
          jobModule.define(agenda);
          console.log(` Loaded job: ${file.replace('.js', '')}`);
        }
      } catch (err) {
        throw new APIError(`Failed to load job ${file}: ${err.message}`, 500);
      }
    }
  }

  async scheduleRecurringJobs() {
    try {
      const autoSchedulerPath = path.join(__dirname, '..', 'jobs', 'autoScheduler.js');
      if (!fs.existsSync(autoSchedulerPath)) {
        console.log('No autoScheduler.js found, skipping recurring jobs.');
        return;
      }

      const { scheduleRecurringTasks } = await import(`file://${autoSchedulerPath}`);
      await scheduleRecurringTasks();
      console.log('All automatic recurring jobs scheduled');
    } catch (err) {
      throw new APIError(`Failed to schedule recurring jobs: ${err.message}`, 500);
    }
  }

  async stop() {
    if (!this.initialized) {
      console.log('Agenda not initialized, skipping stop');
      return;
    }

    try {
      await agenda.stop();
      console.log(' Agenda scheduler stopped');
      this.initialized = false;
    } catch (err) {
      throw new APIError(`Error stopping Agenda: ${err.message}`, 500);
    }
  }

  getStatus() {
    return {
      initialized: this.initialized,
      processEvery: agenda._processEvery,
    };
  }
}

export default new AgendaManager();