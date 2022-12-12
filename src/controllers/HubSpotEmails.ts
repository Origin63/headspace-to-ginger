import {
  processRequest
} from "../helpers/genericAxios";
import {
  emailProperties
} from "../types/HS-Emails";

export default class HubSpotEmails {
  path: string;
  token: string | undefined;
  constructor(token: string | undefined) {
    this.token = token;
    this.path = "https://api.hubapi.com/crm/v3/objects/emails";
  }

  async getEmails(url: string | null = null) {
    try {
      return await processRequest({
        url: url || `${this.path}?limit=100&properties=hs_email_direction,hs_email_status,hs_email_subject,hs_email_text,hs_email_html`,
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

  async checkIfEmailExists(propertyName: string, value: string) {
    const payload = {
      "filterGroups": [{
        "filters": [{
          "value": value,
          "propertyName": propertyName,
          "operator": "CONTAINS_TOKEN"
        }]
      }]
    }
    const endPoint = `https://api.hubapi.com/crm/v3/objects/emails/search`;
    try {
      return await processRequest({
        url: endPoint,
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        },
        data: JSON.stringify(payload)
      });
    } catch (error) {
      throw (error)
    }
  }

  async createEmail(properties: emailProperties) {
    try {
      return await processRequest({
        url: this.path,
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        },
        data: JSON.stringify({properties})
      });
    } catch (error) {
      throw (error)
    }
  }

  async updateEmail(id: string | number, properties: emailProperties) {
    try {
      return await processRequest({
        url: `${this.path}/${id}`,
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        },
        data: JSON.stringify({properties})
      });
    } catch (error) {
      throw (error)
    }
  }
}