import express, { Express } from 'express';
import { ChattyServer } from './setupServer';
import DBConnect from './setupDatabase';
import config from './config';

class Application {
  public initialize() {
    this.loadConfig();
    DBConnect();
    const app: Express = express();
    const server = new ChattyServer(app);
    server.start();
  }

  private loadConfig() {
    config.validate();
  }
}

const app: Application = new Application();
app.initialize();
