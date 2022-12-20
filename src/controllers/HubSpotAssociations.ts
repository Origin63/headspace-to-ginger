import {
  processRequest
} from "../helpers/genericAxios";
import {
  associationObjectType,
} from "../types/HS-Emails";

export default class HubspotAssociations {
  basepath: string;
  token: string | undefined;
  contentType: string;
  constructor(token: string | undefined) {
    this.token = token;
    this.contentType = "application/json";
    this.basepath = "https://api.hubapi.com";
  }

  async associateRecords(fromObject: associationObjectType, toObject: associationObjectType, code : string = 'email_to_contact') {
    const endPoint = `${this.basepath}/crm/v3/objects/${fromObject.objectType}/${fromObject.id}/associations/${toObject.objectType}/${toObject.id}/${code}`;
    return await processRequest({
      url: endPoint,
      method: 'PUT',
      headers: {
        "Content-Type": this.contentType,
        "Authorization": `Bearer ${this.token}`
      }
    });
  }
}