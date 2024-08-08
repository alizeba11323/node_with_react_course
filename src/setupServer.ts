import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookie from 'cookie-session';
import compression from 'compression';
import config from './config';
import 'express-async-errors';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import setupRoutes from './routes';
import Logger from 'bunyan';
import { CustomError, IErrorHandler } from './shared/globals/helpers/errorHandler';
const log: Logger = config.createLogger('server');
export class ChattyServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  public start() {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.routeMiddleware(this.app);
    this.startServer(this.app);
  }
  private securityMiddleware(app: Application) {
    app.use(
      cookie({
        name: 'session',
        keys: [config.SESSION_KEY_ONE!, config.SESSION_KEY_TWO!],
        maxAge: 24 * 7 * 60 * 60 * 1000,
        secure: config.NODE_ENV !== 'development'
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        optionsSuccessStatus: 200
      })
    );
  }
  private standardMiddleware(app: Application) {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }
  private globalErrorHandler(app: Application) {
    app.all('*', (req, res) => {
      res.status(404).json({ message: `${req.originalUrl} not found` });
    });
    app.use((err: IErrorHandler, _req: Request, res: Response, next: NextFunction) => {
      log.error(err);
      if (err instanceof CustomError) {
        res.status(err.statusCode).json(err.serializeError());
      }
      next();
    });
  }
  private async createsocketIO(http: http.Server): Promise<Server> {
    const pubClient = createClient({ url: `${config.REDIS_HOST}` });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    const server: Server = new Server(http, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
      },
      adapter: createAdapter(pubClient, subClient)
    });
    return server;
  }
  private routeMiddleware(app: Application) {
    setupRoutes(app);
  }
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createsocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (err) {
      log.error(err);
    }
  }
  private startHttpServer(httpServer: http.Server) {
    log.info('app runing with process ' + process.pid);
    httpServer.listen(config.PORT, function () {
      log.info(`app running on port ${config.PORT}`);
    });
  }
  private socketIOConnections(socketIO: Server) {}
}
