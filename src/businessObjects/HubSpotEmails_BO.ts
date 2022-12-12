import HubSpotEmails from "../controllers/HubSpotEmails";
import {
  email, emailProperties
} from "../types/HS-Emails";
import {
  hubspotResult
} from "../types/HS-Objects";
import * as dotenv from 'dotenv';
import fs from 'fs';
class HubSpotEmails_BO {

  /**
   * A group of functions that can be executed from the console by passing the key as a console argument
   */
  static ConsoleFunctions: {
    [key: string]: CallableFunction
  } = {
    'getEmails': this.getAllEmailsPaginated.bind(this),
    'migrateEmails': this.migrateEmails.bind(this)
  };

  static data: {
    [key: string | number]: email
  } = {};

  static emptyEmailObject : email = {
    id: '',
    createdAt: '',
    updatedAt: '',
    archived: false,
    properties: {}
  }

  /**
   * Argument to be passed in console to execute a single function
   */
  static ConsoleArgument: string = process.argv[2];

  static init() {
    const consoleFunction = this.ConsoleFunctions[this.ConsoleArgument];
    if (consoleFunction) {
      consoleFunction();
    }
  }

  /**
   * Get All Paginated Emails From Hubspot In a Single Call
   * @return Array of Records
   */
  static async getAllEmailsPaginated(url: null | string = null) {
    try {
      const data = JSON.parse(fs.readFileSync(`${__dirname}/emails.json`).toString());
      if (Object.keys(data).length > 0) {
        return data;
      }

      const hubSpotController = new HubSpotEmails(process.env.HSTOKENJESUS_HDFORWORK);

      const records: hubspotResult = await hubSpotController.getEmails(url);
      const {
        results,
        paging
      } = records;

      this.data = {
        ...this.data,
        ...this.reArrangeHubspotEmailObjectAndSetIdAsKey(results)
      };

      console.log(Object.keys(this.data).length);

      if (paging) {
        this.getAllEmailsPaginated(paging.next.link);
      }

      fs.writeFileSync(`${__dirname}/emails.json`, JSON.stringify(this.data));
      return this.data;
    } catch (error) {
      throw error;
    }

  }

  static reArrangeHubspotEmailObjectAndSetIdAsKey(jsObject: Array < email > ) {

    let newObject: {
      [key: string | number]: email
    } = {};
    for (let key = 0; key < jsObject.length; key++) {
      const id: string | number = jsObject[key].id;
      newObject[id] = jsObject[key];
      newObject[id]['properties']['hs_email_subject'] += ` | HeadSpace For Work ID: ${id}`;
      newObject[id]['properties']['hs_timestamp'] = new Date(newObject[id]['updatedAt']).toISOString();
      delete newObject[id]['properties']['hs_createdate'];
      delete newObject[id]['properties']['hs_object_id'];
    }

    return newObject;
  }

  static recordExists(records: hubspotResult) {
    if (records.results && records.results.length > 0) {
      return records.results[0];
    }

    return this.emptyEmailObject;
  }

  static async migrateEmails() {
    try {
      const gingerHubspotController = new HubSpotEmails(process.env.HSTOKENJESUS_GINGER);
      const emails = await this.getAllEmailsPaginated();
      for (let key in emails) {
        await this.delay(300);
        let emailSearch : hubspotResult = await gingerHubspotController.checkIfEmailExists('hs_email_subject', key)
        const existingEmail: email = this.recordExists(emailSearch);
        const properties = emails[key].properties;
        if (existingEmail.id) {
          const {
            id
          } = existingEmail;
          console.log('updating email');
          gingerHubspotController.updateEmail(id, properties);
        } else {
          console.log('creating email');
          gingerHubspotController.createEmail(properties);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a Delay based on the ms provided
   * @param {String} ms - Miliseconds
   */
  static async delay(ms: number) {
    return new Promise(response => setTimeout(response, ms));
  }
}

dotenv.config();
HubSpotEmails_BO.init();