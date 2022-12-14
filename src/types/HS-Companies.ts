/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Properties {
  [key: string]: any;
}

export interface UpdateCompanies {
  id: number;
  properties: Properties;
}

export interface InsertCompanies {
  properties: Properties;
}
