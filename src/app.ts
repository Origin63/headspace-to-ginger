import * as dotenv from 'dotenv';
import Logger from './helpers/genericLogger';

class App {
  static init = () => {
    dotenv.config();
    Logger.info('starting project');
  };
}

App.init();
