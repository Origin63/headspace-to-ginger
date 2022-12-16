export interface email {
  id: string | number,
  createdAt: string,
  updatedAt: string,
  archived: boolean,
  associated_contacts?: Array<string>,
  properties: emailProperties
}

export interface emailProperties {
  hs_timestamp ? : string,
  hs_email_direction ? : string,
  hs_email_status ? : string,
  hs_email_subject ? : string,
  hs_email_text ? : string,
  hs_email_html ? : string,
  hs_createdate ? : string,
  hs_object_id ? : string
}

export interface associationObjectType {
  id: string | number,
  objectType: string
}

export interface hubspotResult {
  results: Array < email > ,
  paging?: undefined | {
    next: {
      afer: string,
      link: string
    }
  }
}

export interface emailAssociations {
  toObjectId: string | number,
  associationTypes ? : any[]
}

export interface associationResults {
  results: emailAssociations[] ,
  paging?: undefined | {
    next: {
      afer: string,
      link: string
    }
  }
}
export interface localEmailData {
  [key: number | string]: any
}