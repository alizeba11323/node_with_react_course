"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bunyan_1 = __importDefault(require("bunyan"));
dotenv_1.default.config({});
class Config {
    constructor() {
        this.DEFAULT_DB = 'mongodb://127.0.0.1:27017/chatty_backend_db';
        this.PORT = process.env.PORT || '4000';
        this.MONGODB_URL = process.env.MONGODB_URL || this.DEFAULT_DB;
        this.JWT_SECRET = process.env.JWT_SECRET || '';
        this.SESSION_KEY_ONE = process.env.SESSION_KEY_ONE || '';
        this.SESSION_KEY_TWO = process.env.SESSION_KEY_TWO || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        this.REDIS_HOST = process.env.REDIS_HOST;
    }
    createLogger(name) {
        return bunyan_1.default.createLogger({ name, level: 'debug' });
    }
    validate() {
        for (let [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(`value of ${key} is undefined`);
            }
        }
    }
}
const config = new Config();
exports.default = config;
//# sourceMappingURL=config.js.map