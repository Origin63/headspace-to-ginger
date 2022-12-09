export interface contact {
  firstname: string;
  lastname: string;
  company: string;
  email: string;
  phone: string;
  jobtitle: string;
  hubspot_owner_id: number;
}

export type updateContact = {
  id: number | string;
  properties: contact;
};

export type insertContact = {
  properties: contact;
};
