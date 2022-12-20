export interface contact {
  id: string | number,
  createdAt: string,
  updatedAt: string,
  archived: boolean,
  properties: Properties,
  associated_companies?: string[]
}

export interface Properties {
  [key: string]: any;
}

export type updateContact = {
  id: number | string;
  properties: Properties;
  associated_companies?: string[]
};

export type insertContact = {
  properties: Properties;
  associated_companies?: string[]
};

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

export interface localContactData {
  [key: number | string]: any
}