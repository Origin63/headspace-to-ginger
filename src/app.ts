import * as dotenv from 'dotenv';
import HubSpotCompanies_BO from './businessObjects/HubSpotCompanies_BO';
import Logger from './helpers/genericLogger';

class App {
  static init = () => {
    try {
      dotenv.config();
      Logger.info('starting project');
      this.migrateCompanies();
    } catch (error) {
      Logger.error('Error in App.init', { message: error });
    }
  };

  static migrateCompanies = () => {
    try {
      HubSpotCompanies_BO.migrateCompanies();
    } catch (error) {
      Logger.error('Error in App.migrateCompanies', { message: error });
    }
  };
}

App.init();
