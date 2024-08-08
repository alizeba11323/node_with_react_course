import mongoose from 'mongoose';
import config from './config';
import Logger from 'bunyan';
export default () => {
  const log: Logger = config.createLogger('db:log');
  const connect = () => {
    mongoose
      .connect(config.MONGODB_URL!)
      .then(() => log.info('DB Connected...'))
      .catch((err) => {
        log.error('error occure in db Connection ' + err.message);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};
