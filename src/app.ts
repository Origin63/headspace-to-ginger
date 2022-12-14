import * as dotenv from 'dotenv';
import HubSpotCompanies_BO from './businessObjects/HubSpotCompanies_BO';
import Logger from './helpers/genericLogger';

class App {
  static init = () => {
    dotenv.config();
    Logger.info('starting project');
    this.migrateCompanies();
  };

  static migrateCompanies = () => {
    try {
      HubSpotCompanies_BO.migrateCompanies();
    } catch (error) {
      Logger.error('Error migrating companies', { message: error });
    }
  };
}

App.init();
