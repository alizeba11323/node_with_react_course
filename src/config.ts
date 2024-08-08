import dotenv from 'dotenv';
import bunyan from 'bunyan';
dotenv.config({});

class Config {
  public PORT: string | undefined;
  public MONGODB_URL: string | undefined;
  public JWT_SECRET: string | undefined;
  public SESSION_KEY_ONE: string | undefined;
  public SESSION_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public NODE_ENV: string | undefined;
  public REDIS_HOST: string | undefined;
  private readonly DEFAULT_DB = 'mongodb://127.0.0.1:27017/chatty_backend_db';
  constructor() {
    this.PORT = process.env.PORT || '4000';
    this.MONGODB_URL = process.env.MONGODB_URL || this.DEFAULT_DB;
    this.JWT_SECRET = process.env.JWT_SECRET || '';
    this.SESSION_KEY_ONE = process.env.SESSION_KEY_ONE || '';
    this.SESSION_KEY_TWO = process.env.SESSION_KEY_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.REDIS_HOST = process.env.REDIS_HOST;
  }
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }
  public validate() {
    for (let [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`value of ${key} is undefined`);
      }
    }
  }
}

const config: Config = new Config();
export default config;
