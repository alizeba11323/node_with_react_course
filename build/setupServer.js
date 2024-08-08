"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChattyServer = void 0;
const express_1 = require("express");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const compression_1 = __importDefault(require("compression"));
const config_1 = __importDefault(require("./config"));
require("express-async-errors");
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./shared/globals/helpers/errorHandler");
const log = config_1.default.createLogger('server');
class ChattyServer {
    constructor(app) {
        this.app = app;
    }
    start() {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.routeMiddleware(this.app);
        this.startServer(this.app);
    }
    securityMiddleware(app) {
        app.use((0, cookie_session_1.default)({
            name: 'session',
            keys: [config_1.default.SESSION_KEY_ONE, config_1.default.SESSION_KEY_TWO],
            maxAge: 24 * 7 * 60 * 60 * 1000,
            secure: config_1.default.NODE_ENV !== 'development'
        }));
        app.use((0, hpp_1.default)());
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)({
            origin: config_1.default.CLIENT_URL,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            optionsSuccessStatus: 200
        }));
    }
    standardMiddleware(app) {
        app.use((0, compression_1.default)());
        app.use((0, express_1.json)({ limit: '50mb' }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    }
    globalErrorHandler(app) {
        app.all('*', (req, res) => {
            res.status(404).json({ message: `${req.originalUrl} not found` });
        });
        app.use((err, _req, res, next) => {
            log.error(err);
            if (err instanceof errorHandler_1.CustomError) {
                res.status(err.statusCode).json(err.serializeError());
            }
            next();
        });
    }
    createsocketIO(http) {
        return __awaiter(this, void 0, void 0, function* () {
            const pubClient = (0, redis_1.createClient)({ url: `${config_1.default.REDIS_HOST}` });
            const subClient = pubClient.duplicate();
            yield Promise.all([pubClient.connect(), subClient.connect()]);
            const server = new socket_io_1.Server(http, {
                cors: {
                    origin: config_1.default.CLIENT_URL,
                    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
                },
                adapter: (0, redis_adapter_1.createAdapter)(pubClient, subClient)
            });
            return server;
        });
    }
    routeMiddleware(app) {
        (0, routes_1.default)(app);
    }
    startServer(app) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const httpServer = new http_1.default.Server(app);
                const socketIO = yield this.createsocketIO(httpServer);
                this.startHttpServer(httpServer);
                this.socketIOConnections(socketIO);
            }
            catch (err) {
                log.error(err);
            }
        });
    }
    startHttpServer(httpServer) {
        log.info('app runing with process ' + process.pid);
        httpServer.listen(config_1.default.PORT, function () {
            log.info(`app running on port ${config_1.default.PORT}`);
        });
    }
    socketIOConnections(socketIO) { }
}
exports.ChattyServer = ChattyServer;
//# sourceMappingURL=setupServer.js.map