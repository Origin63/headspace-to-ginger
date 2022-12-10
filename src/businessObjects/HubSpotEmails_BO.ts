import HubSpotEmails from "../controllers/HubSpotEmails";
import { email } from "../types/HS-Emails";
import { hubspotResult } from "../types/HS-Objects";
class HubSpotEmails_BO {

  /**
   * A group of functions that can be executed from the console by passing the key as a console argument
   */
  static ConsoleFunctions: {
    [key: string]: CallableFunction
  } = {
    'emails': this.getAllEmailsPaginated.bind(this),
  };

  static data: { [key: string | number] : email } = {};

  /**
   * Argument to be passed in console to execute a single function
   */
  static ConsoleArgument: string = process.argv[2];

  static init() {
    const consoleFunction = this.ConsoleFunctions[this.ConsoleArgument];
    if(consoleFunction) {
      consoleFunction();
    }
  }

  /**
   * Get All Paginated Emails From Hubspot In a Single Call
   * @return Array of Records
   */
  static async getAllEmailsPaginated(url: null | string = null) {
    const hubSpotController = new HubSpotEmails(process.env.HSTOKENJESUS_HDFORWORK);
    const records : hubspotResult = await hubSpotController.getEmails(url);
    const {results, paging} = records;

    this.data = {
      ...this.data,
      ...this.reArrangeHubspotEmailObjectAndSetIdAsKey(results)
    };

    console.log(Object.keys(this.data).length);

    if (paging) {
      this.getAllEmailsPaginated(paging.next.link);
    }

    return this.data;
  }

  static reArrangeHubspotEmailObjectAndSetIdAsKey(jsObject : Array<email>) {
    
    let newObject: { [key: string | number] : email } = {};
    for(let key = 0; key < jsObject.length; key++) {
      const id: string | number = jsObject[key].id;
      newObject[id] = jsObject[key];
    }

    return newObject;
  }
}

HubSpotEmails_BO.init();
