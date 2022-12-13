import {
  processRequest
} from "../helpers/genericAxios";
import {
  associationObjectType,
  contactProperties
} from "../types/HS-Contacts";

export default class HubSpotContacts {
  path: string;
  token: string | undefined;
  constructor(token: string | undefined) {
    this.token = token;
    this.path = "https://api.hubapi.com/crm/v3/objects/contacts";
  }

  async getContact(id: string | number) {
    try {
      return await processRequest({
        url: `${this.path}/${id}?properties=firstname,lastname,email,phone`,
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

  async getContacts(url: string | null = null) {
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

  async checkIfContactExists(propertyName: string, value: string) {
    const payload = {
      "filterGroups": [{
        "filters": [{
          "value": value,
          "propertyName": propertyName,
          "operator": "CONTAINS_TOKEN"
        }]
      }]
    }
    const endPoint = `https://api.hubapi.com/crm/v3/objects/contacts/search`;
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

  async checkIfContactExistsByEmail(email: string) {
    const payload = {
      "filterGroups": [{
        "filters": [{
          "value": email,
          "propertyName": "email",
          "operator": "EQ"
        }]
      }]
    }
    const endPoint = `https://api.hubapi.com/crm/v3/objects/contacts/search`;
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

  async createContact(properties: contactProperties) {
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

  async updateContact(id: string | number, properties: contactProperties) {
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