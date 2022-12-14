export interface contact {
  id: string | number,
    createdAt: string,
    updatedAt: string,
    archived: boolean,
    properties: contactProperties
}

export type updateContact = {
  id: number | string;
  properties: contact;
};

export type insertContact = {
  properties: contact;
};

export interface contactProperties {
  firstname: string;
  lastname: string;
  company?: string;
  email: string;
  phone: string;
  jobtitle?: string;
  hubspot_owner_id?: number;
}

export interface associationObjectType {
  id: string | number,
    objectType: string
}

export interface hubspotResult {
  results: Array < contact > ,
    paging: undefined | {
      next: {
        afer: string,
        link: string
      }
    }
}

export interface contactAssociations {
  toObjectId: string | number,
    associationTypes ? : Array < any >
}

export interface associationResults {
  results: Array < contactAssociations > ,
    paging: undefined | {
      next: {
        afer: string,
        link: string
      }
    }
}