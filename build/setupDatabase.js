"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
exports.default = () => {
    const log = config_1.default.createLogger('db:log');
    const connect = () => {
        mongoose_1.default
            .connect(config_1.default.MONGODB_URL)
            .then(() => log.info('DB Connected...'))
            .catch((err) => {
            log.error('error occure in db Connection ' + err.message);
            return process.exit(1);
        });
    };
    connect();
    mongoose_1.default.connection.on('disconnected', connect);
};
//# sourceMappingURL=setupDatabase.js.map