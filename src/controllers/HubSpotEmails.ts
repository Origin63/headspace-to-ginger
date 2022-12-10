import {
  processRequest
} from "../helpers/genericAxios";

export default class HubSpotEmails {
  path: string;
  token: string | undefined;
  constructor(token: string | undefined) {
    this.token = token;
    this.path = "https://api.hubapi.com/crm/v3/objects/emails";
  }

  async getEmails(url : string | null = null) {
    try {
      return await processRequest({
        url: url || this.path,
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        }
      });
    } catch (error) {
      throw (error)
    }
  }
}