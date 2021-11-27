class Logger {
  constructor() {
    this.isTestEnv = process.env.NODE_ENV === 'test';
  }

  log(...args) {
    if (!this.isTestEnv) {
      console.log(...args);
    }
  }

  error(...args) {
    if (!this.isTestEnv) {
      console.error(...args);
    }
  }
}

const logger = new Logger();

module.exports = logger;