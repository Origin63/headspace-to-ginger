import * as dotenv from 'dotenv';
import HubSpotCompanies_BO from './businessObjects/HubSpotCompanies_BO';
import Logger from './helpers/genericLogger';
class App {
  static init = async () => {
    try {
      dotenv.config();
      Logger.info('starting project');
      // this.migrateCompanies();
      HubSpotCompanies_BO.loadInstances();
      HubSpotCompanies_BO.loadData();
      const completed = await HubSpotCompanies_BO.fetchAllCompanies();
      if (completed) await HubSpotCompanies_BO.migrateCompanies();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in App.init', error);
      Logger.error('Error in App.init', { message: error });
    }
  };
}

App.init();
