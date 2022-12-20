import { AxiosRequestConfig } from 'axios';
import { processRequest } from '../helpers/genericAxios';
import Utils from '../helpers/genericUtils';
import { InsertCompanies } from '../types/HS-Companies';
import { associationObjectType, insertContact, updateContact } from '../types/HS-Contacts';
import { HSPayload, Result, SearchResponse } from '../types/HS-Search';
import * as dotenv from 'dotenv';

interface BatchResponse {
  status: string;
  results: Result[];
  requestedAt: string;
  startedAt: string;
  completedAt: string;
  links: Links;
}

interface Links {
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
}

export default class HubSpotContacts {
  path: string;
  token: string | undefined;
  contentType = 'application/json';
  private accept = 'application/json';
  constructor(token: string | undefined) {
    dotenv.config();
    this.token = token;
    this.path = 'https://api.hubapi.com/crm/v3/objects/contacts';
  }

  async getContact(id: string | number) {
    return await processRequest({
      url: `${this.path}/${id}?properties=firstname,lastname,email,phone`,
      method: 'GET',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async getContacts(url: string | null = null) {
    return await processRequest({
      url:
        url ||
        `${this.path}?limit=100&properties=do_not_sync_to_sf,email,email_unique__c,numberofemployees,employee_lead_form_tier,exclude_from_evergreen,executive_sponsor_email,hs_facebook_click_id,fax,field_of_study,first_marketing_qualified_lead_date,firstname,followercount,gdpr_opt_in,gender,ginger_id,hs_google_click_id,graduation_date,headspace_org,company_size2,how_would_you_like_to_partner_,hr_contact_s_role,hr_contact_s_first_name,hr_contact_s_last_name,hr_contact_s_phone_number,hsuserid,hubspot_workflow_status,i_am_a_n____refer_your_company,incoming_notes__c,industry,case_studies,interviews_with_media,speaking_opportunities_on_behalf_of_headspace_e_g_live_events_,invitations_to_speak_with_prospective_customers_we_ll_contact_you_first,is_customer_admin,is_lead_,job_function,job_level,jobtitle,journey,kloutscoregeneral,last_activity_sf_,notes_last_updated,hs_email_last_open_date,lastname,hs_latest_source,hs_latest_source_timestamp,lead_owner_name,lead_owner_role_name,leadsource,lead_source_detail,lead_status_detail,lead_type,lifecyclestage,linkedinbio,campaign_medium,campaign_source,linkedin_company_size,linkedinconnections,linkedin_lead_gen_form,linkedin_url__c,logo_on_headspace_website_s_,logo_on_publicly_available_marketing_materials_e_g_headspace_program_overview_,logo_on_sales_materials_e_g_sales_presentations_,marital_status,marketing_qualified_date_time,member_gratitude,member_intention,hs_content_membership_notes,mention_of_company_name_within_online_advertising,mention_of_relationship_with_media,message,military_status,mobilephone,monthly_price_per_license__c,most_recent_cadence_last_completed_step,mql_new,mql_type,nhs_executive_sponsor_name,numemployees,number_of_licenses__c,on_v3,salesforceopportunitystage,opt_in,hs_analytics_source,hs_analytics_source_data_1,hs_analytics_source_data_2,partnership,partnership_budget,partnership_opportunity_size,partnership_type,i_am_a_,hs_persona,phone_number,phone,zip,hs_language,primary_product_interest,province_chilipiper_,rating,referral_date,referred_by,relationship_status,role__c,salutation,school,score__c,send_welcome_emails_internal_,send_welcome_emails_to_admin_,seniority,source__c,start_date,state_chilipiper_,consultant_location,employer_hq,state,hs_content_membership_status,leadstatus,address,sync_to_hubspot__contact_,territory,hs_time_between_contact_creation_and_deal_close,hs_time_between_contact_creation_and_deal_creation,hs_time_to_move_from_lead_to_customer,hs_time_to_move_from_marketingqualifiedlead_to_customer,hs_time_to_move_from_opportunity_to_customer,hs_time_to_move_from_salesqualifiedlead_to_customer,hs_time_to_move_from_subscriber_to_customer,hs_timezone,trust_name,twitterbio,twitterprofilephoto,twitterhandle,type_of_contact,utm_campaign,utm_content,utm_medium,utm_source,utm_term,website,work_email,o63__contacts_for_migration`,
      method: 'GET',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async checkIfContactExists(propertyName: string, value: string) {
    const payload = {
      filterGroups: [
        {
          filters: [
            {
              value: value,
              propertyName: propertyName,
              operator: 'CONTAINS_TOKEN',
            },
          ],
        },
      ],
    };
    const endPoint = `https://api.hubapi.com/crm/v3/objects/contacts/search`;

    return await processRequest({
      url: endPoint,
      method: 'POST',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${this.token}`,
      },
      data: JSON.stringify(payload),
    });
  }

  async checkIfContactExistsByEmail(email: string) {
    const payload = {
      filterGroups: [
        {
          filters: [
            {
              value: email,
              propertyName: 'email',
              operator: 'EQ',
            },
          ],
        },
      ],
    };
    const endPoint = `https://api.hubapi.com/crm/v3/objects/contacts/search`;

    return await processRequest({
      url: endPoint,
      method: 'POST',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${this.token}`,
      },
      data: JSON.stringify(payload),
    });
  }

  async createContact(properties: any) {
    return await processRequest({
      url: this.path,
      method: 'POST',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${this.token}`,
      },
      data: JSON.stringify({ properties }),
    });
  }

  async updateContact(id: string | number, properties: any) {
    return await processRequest({
      url: `${this.path}/${id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': this.contentType,
        Authorization: `Bearer ${this.token}`,
      },
      data: JSON.stringify({ properties }),
    });
  }

  insertContacts = async (
    dataToInsert: insertContact[]
  ): Promise<BatchResponse[]> => {
    const dataChunked = Utils.getDataChunked(dataToInsert);
    return Promise.all(
      dataChunked.map(async (element) => {
        const axiosRequest: AxiosRequestConfig = {
          method: 'POST',
          url: `${process.env.HS_BASE_URL}/${this.path}/batch/create`,
          data: {
            inputs: element,
          },
          headers: {
            'Content-Type': this.contentType,
            Authorization: `Bearer ${this.token}`,
          },
        };

        return await processRequest(axiosRequest);
      })
    );
  };

  updateContacts = async (
    dataToUpdate: updateContact[]
  ): Promise<BatchResponse[]> => {
    const dataChunked = Utils.getDataChunked(dataToUpdate);
    return Promise.all(
      dataChunked.map(async (element) => {
        const axiosRequest: AxiosRequestConfig = {
          method: 'POST',
          url: `${process.env.HS_BASE_URL}/${this.path}/batch/update`,
          data: {
            inputs: element,
          },
          headers: {
            'Content-Type': this.contentType,
            Authorization: `Bearer ${this.token}`,
          },
        };

        return await processRequest(axiosRequest);
      })
    );
  };

  async getContactCompanyAssociations(fromObject: associationObjectType) {
    try {
      const data = await processRequest({
        url: `https://api.hubapi.com/crm/v4/objects/${fromObject.objectType}/${fromObject.id}/associations/company`,
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        }
      });

      return data;
    } catch (error) {
      throw error; 
    }
  }
}
