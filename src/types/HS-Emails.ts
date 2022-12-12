export interface email {
  id: string | number,
  createdAt: string,
  updatedAt: string,
  archived: boolean,
  properties: emailProperties
}

export interface emailProperties {
  hs_timestamp?: string,
  hs_email_direction?: string,
  hs_email_status?: string,
  hs_email_subject?: string,
  hs_email_text?: string,
  hs_email_html?: string,
  hs_createdate?: string,
  hs_object_id?: string
}
