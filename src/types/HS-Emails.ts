export interface email {
  id: string | number,
  createdAt: string,
  updatedAt: string,
  archived: boolean,
  properties: object
}

export type updateemail = {
  id: number | string;
  properties: email;
};

export type insertemail = {
  properties: email;
};
