import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Simple Logger Configuration
 * Logs to console and file
 */

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

export const logger = {
  info: (message, data = '') => {
    const log = `[${getTimestamp()}] INFO: ${message} ${data}`;
    console.log(log);
    appendToLogFile(log);
  },

  error: (message, error = '') => {
    const log = `[${getTimestamp()}] ERROR: ${message} ${error}`;
    console.error(log);
    appendToLogFile(log);
  },

  warn: (message, data = '') => {
    const log = `[${getTimestamp()}] WARN: ${message} ${data}`;
    console.warn(log);
    appendToLogFile(log);
  },

  debug: (message, data = '') => {
    if (process.env.DEBUG === 'true') {
      const log = `[${getTimestamp()}] DEBUG: ${message} ${data}`;
      console.log(log);
      appendToLogFile(log);
    }
  },
};

const appendToLogFile = (log) => {
  const logFile = path.join(logsDir, 'app.log');
  fs.appendFileSync(logFile, log + '\n', 'utf8');
};

export default logger;
