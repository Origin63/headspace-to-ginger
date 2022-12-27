import HubspotContacts from '../controllers/HubSpotContacts';
import HubSpotSearch from '../controllers/HubSpotSearch';
import Utils from '../helpers/genericUtils';
import * as dotenv from 'dotenv';

import {
  Result
} from '../types/HS-Search';
import mappingProps from '../data/contactsMappingProps.json';
import Logger from '../helpers/genericLogger';
import HubSpotOwners, {
  OwnersResult
} from '../controllers/HubSpotOwners';
import {
  cwd
} from 'process';
import path from 'path';
import {
  associationResults,
  contact,
  contactAssociations,
  hubspotResult,
  localContactData,
  insertContact,
  updateContact
} from '../types/HS-Contacts';
import HubSpotContacts from '../controllers/HubSpotContacts';
import fs from 'fs';
import HubSpotCompanies from '../controllers/HubSpotCompanies';
import HubspotAssociations from '../controllers/HubSpotAssociations';

export default class HubspotContacts_BO {
  static propsGingerToLookup =
    'do_not_sync_to_sf,email,hubspot_owner_id,email_unique__c,numberofemployees,headspace_for_work_id,employee_lead_form_tier,exclude_from_evergreen,executive_sponsor_email,hs_facebook_click_id,fax,field_of_study,first_marketing_qualified_lead_date,firstname,followercount,gdpr_opt_in,gender,ginger_id,hs_google_click_id,graduation_date,headspace_org,company_size2,how_would_you_like_to_partner_,hr_contact_s_role,hr_contact_s_first_name,hr_contact_s_last_name,hr_contact_s_phone_number,hsuserid,hubspot_workflow_status,i_am_a_n____refer_your_company,incoming_notes__c,industry,case_studies,interviews_with_media,speaking_opportunities_on_behalf_of_headspace_e_g_live_events_,invitations_to_speak_with_prospective_customers_we_ll_contact_you_first,is_customer_admin,is_lead_,job_function,job_level,jobtitle,journey,kloutscoregeneral,last_activity_sf_,notes_last_updated,hs_email_last_open_date,lastname,hs_latest_source,hs_latest_source_timestamp,lead_owner_name,lead_owner_role_name,leadsource,lead_source_detail,lead_status_detail,lead_type,lifecyclestage,linkedinbio,campaign_medium,campaign_source,linkedin_company_size,linkedinconnections,linkedin_lead_gen_form,linkedin_url__c,logo_on_headspace_website_s_,logo_on_publicly_available_marketing_materials_e_g_headspace_program_overview_,logo_on_sales_materials_e_g_sales_presentations_,marital_status,marketing_qualified_date_time,member_gratitude,member_intention,hs_content_membership_notes,mention_of_company_name_within_online_advertising,mention_of_relationship_with_media,message,military_status,mobilephone,monthly_price_per_license__c,most_recent_cadence_last_completed_step,mql_new,mql_type,nhs_executive_sponsor_name,numemployees,number_of_licenses__c,on_v3,salesforceopportunitystage,opt_in,hs_analytics_source,hs_analytics_source_data_1,hs_analytics_source_data_2,partnership,partnership_budget,partnership_opportunity_size,partnership_type,i_am_a_,hs_persona,phone_number,phone,zip,hs_language,primary_product_interest,province_chilipiper_,rating,referral_date,referred_by,relationship_status,role__c,salutation,school,score__c,send_welcome_emails_internal_,send_welcome_emails_to_admin_,seniority,source__c,start_date,state_chilipiper_,consultant_location,employer_hq,state,hs_content_membership_status,leadstatus,address,sync_to_hubspot__contact_,territory,hs_time_between_contact_creation_and_deal_close,hs_time_between_contact_creation_and_deal_creation,hs_time_to_move_from_lead_to_customer,hs_time_to_move_from_marketingqualifiedlead_to_customer,hs_time_to_move_from_opportunity_to_customer,hs_time_to_move_from_salesqualifiedlead_to_customer,hs_time_to_move_from_subscriber_to_customer,hs_timezone,trust_name,twitterbio,twitterprofilephoto,twitterhandle,type_of_contact,utm_campaign,utm_content,utm_medium,utm_source,utm_term,website,work_email';

  static propsHFWToLookUp =
    'do_not_sync_to_sf,email,email_unique__c,numberofemployees,employee_lead_form_tier,exclude_from_evergreen,executive_sponsor_email,hs_facebook_click_id,fax,field_of_study,first_marketing_qualified_lead_date,firstname,followercount,gdpr_opt_in,gender,ginger_id,hs_google_click_id,graduation_date,headspace_org,company_size2,how_would_you_like_to_partner_,hr_contact_s_role,hr_contact_s_first_name,hr_contact_s_last_name,hr_contact_s_phone_number,hsuserid,hubspot_workflow_status,i_am_a_n____refer_your_company,incoming_notes__c,industry,case_studies,interviews_with_media,speaking_opportunities_on_behalf_of_headspace_e_g_live_events_,invitations_to_speak_with_prospective_customers_we_ll_contact_you_first,is_customer_admin,is_lead_,job_function,job_level,jobtitle,journey,kloutscoregeneral,last_activity_sf_,notes_last_updated,hs_email_last_open_date,lastname,hs_latest_source,hs_latest_source_timestamp,lead_owner_name,lead_owner_role_name,leadsource,lead_source_detail,lead_status_detail,lead_type,lifecyclestage,linkedinbio,campaign_medium,campaign_source,linkedin_company_size,linkedinconnections,linkedin_lead_gen_form,linkedin_url__c,logo_on_headspace_website_s_,logo_on_publicly_available_marketing_materials_e_g_headspace_program_overview_,logo_on_sales_materials_e_g_sales_presentations_,marital_status,marketing_qualified_date_time,member_gratitude,member_intention,hs_content_membership_notes,mention_of_company_name_within_online_advertising,mention_of_relationship_with_media,message,military_status,mobilephone,monthly_price_per_license__c,most_recent_cadence_last_completed_step,mql_new,mql_type,nhs_executive_sponsor_name,numemployees,number_of_licenses__c,on_v3,salesforceopportunitystage,opt_in,hs_analytics_source,hs_analytics_source_data_1,hs_analytics_source_data_2,partnership,partnership_budget,partnership_opportunity_size,partnership_type,i_am_a_,hs_persona,phone_number,phone,zip,hs_language,primary_product_interest,province_chilipiper_,rating,referral_date,referred_by,relationship_status,role__c,salutation,school,score__c,send_welcome_emails_internal_,send_welcome_emails_to_admin_,seniority,source__c,start_date,state_chilipiper_,consultant_location,employer_hq,state,hs_content_membership_status,leadstatus,address,sync_to_hubspot__contact_,territory,hs_time_between_contact_creation_and_deal_close,hs_time_between_contact_creation_and_deal_creation,hs_time_to_move_from_lead_to_customer,hs_time_to_move_from_marketingqualifiedlead_to_customer,hs_time_to_move_from_opportunity_to_customer,hs_time_to_move_from_salesqualifiedlead_to_customer,hs_time_to_move_from_subscriber_to_customer,hs_timezone,trust_name,twitterbio,twitterprofilephoto,twitterhandle,type_of_contact,utm_campaign,utm_content,utm_medium,utm_source,utm_term,website,work_email,o63__contacts_for_migration';

  static HFWOwners: OwnersResult;
  static gingerOwners: OwnersResult;

  static data: localContactData = {};
  static completed: any = {};
  static hubspotSearch: InstanceType < typeof HubSpotSearch >
    static hubspotAssociations: InstanceType < typeof HubspotAssociations >
    static hubspotContacts: InstanceType < typeof HubspotContacts >
    static hubspotCompanies: InstanceType < typeof HubSpotCompanies >
    static h4wOwnersInstance: InstanceType < typeof HubSpotOwners >
    static gingerOwnersInstance: InstanceType < typeof HubSpotOwners >

    /**
     * Argument to be passed in console to execute a single function
     */
    static ConsoleArgument: string = process.argv[2];

  static ConsoleFunctions: {
    [key: string]: CallableFunction
  } = {
    'getContacts': this.getAllContactsPaginated.bind(this),
    'migrateContacts': this.migrateContacts.bind(this),
    'count': this.countContacts.bind(this)
  };

  static iteration: number = 0;

  static loadInstances() {
    dotenv.config();
    this.hubspotSearch = new HubSpotSearch(process.env.HSTOKENJESUS_GINGER as string);
    this.hubspotAssociations = new HubspotAssociations(process.env.HSTOKENJESUS_GINGER as string);
    this.hubspotContacts = new HubspotContacts(process.env.HSTOKENJESUS_HDFORWORK as string);
    this.hubspotCompanies = new HubSpotCompanies(process.env.HSTOKENJESUS_HDFORWORK as string);
    this.h4wOwnersInstance = new HubSpotOwners(process.env.HSTOKENJESUS_HDFORWORK as string);
    this.gingerOwnersInstance = new HubSpotOwners(process.env.HSTOKENJESUS_GINGER as string);
  }

  static init() {
    dotenv.config();
    const consoleFunction = this.ConsoleFunctions[this.ConsoleArgument];
    if (consoleFunction) {
      consoleFunction(process.argv[3]);
    }
  }

  /**
   * Get All Paginated Emails From Hubspot In a Single Call
   * @return Array of Records
   */
  static async getAllContactsPaginated(url: null | string = null, next: boolean = false) {
    try {
      this.loadInstances();
      if (!url || next) {
        this.data = Utils.readJsonFile(path.join(cwd(), '/src/data', `contacts-${this.iteration}.json`));

        if (this.data && Object.keys(this.data).length > 0 && !this.data['paging']) {
          return this.data;
        }

        if (this.data && this.data['paging']) {
          const {
            next: {
              link
            }
          } = this.data['paging'];
          url = link;

          if (Object.keys(this.data).length > 70000) {
            this.iteration = this.iteration + 1;
            this.data = {paging: this.data.paging || null};
            await this.getAllContactsPaginated(url, true);
          }
        }
      }

      const records: hubspotResult = await this.hubspotContacts.getContacts(url);
      const {
        results,
        paging
      } = records;

      this.data = {
        ...this.data,
        ...await this.reArrangeHubspotContactObjectAndSetIdAsKey(results),
        paging: paging
      };

      console.log(Object.keys(this.data).length);
      fs.writeFileSync(path.join(cwd(), '/src/data', `contacts-${this.iteration}.json`), JSON.stringify(this.data));

      if (paging) {
        await this.getAllContactsPaginated(paging.next.link);
      }

      delete this.data.paging;
      return this.data;
    } catch (error) {
      throw error;
    }
  }

  static async reArrangeHubspotContactObjectAndSetIdAsKey(jsObject: Array < contact > ) {
    try {
      var newObject: {
        [key: string | number]: contact
      } = {};
      for (let key = 0; key < jsObject.length; key++) {
        try {
          if (jsObject[key].properties.o63__contacts_for_migration) {
            const id: string | number = jsObject[key].id;
            newObject[id] = jsObject[key];
            newObject[id]['properties']['headspace_for_work_id'] = id;
            newObject[id]['associated_companies'] = [];
            const contactAssociations: associationResults = await this.hubspotContacts.getContactCompanyAssociations({
              objectType: 'contact',
              id: id
            });

            const results: contactAssociations[] = contactAssociations.results;

            for (let i = 0; i < results.length; i++) {
              const {
                toObjectId
              } = results[i];

              toObjectId && newObject[id]['associated_companies']?.push(toObjectId?.toString())
            }
          }
        } catch (error) {
          await Utils.delay(10000);
          key--;
        }
      }
      return newObject;
    } catch (error) {
      console.log('there was an error, reproducing the same step again');
    }
  }

  static countContacts() {
    const data: localContactData = Utils.readJsonFile(path.join(cwd(), '/src/data', 'emails.json'));

    console.log(Object.keys(data).length)
  }

  static async migrateContacts(filename: string = 'contacts-0'): Promise < void > {
    console.log(filename);
    try {
      this.loadInstances();
      const gingerContacts = new HubspotContacts(
        process.env.HSTOKENJESUS_GINGER as string
      );

      this.data = Utils.readJsonFile(path.join(cwd(), '/src/data', `${filename}.json`));
      const chuncks = Utils.getDataChunked(Object.values(this.data), 30);
      await this.loadOwners();

      for (let index = 0; index < chuncks.length; index++) {
        try {
          const chunck = chuncks[index];
          const [dataToInsert, dataToUpdate] =
          await this.checkContactAndSetSeparateValues(
            chunck
          );

          await this.createBatchContact(gingerContacts, dataToInsert);

          await this.updateBatchContact(gingerContacts, dataToUpdate);
        } catch (error) {
          console.log(error);
        }
      }

    } catch (error) {
      Utils.saveFile('_errorloopHF4Companies.txt', error);
      return Promise.reject(error);
    }
  }

  static checkContactAndSetSeparateValues = async (
    contacts: any[]
  ): Promise < [insertContact[], updateContact[]] > => {
    try {
      const dataToInsert: insertContact[] = [];
      const dataToUpdate: updateContact[] = [];
      const completed = Utils.readJsonFile(path.join(cwd(), '/src/data', 'contacts_done.json'));

      for (let index = 0; index < contacts.length; index++) {
        try {
          console.log('processing %d of %d', index, Object.keys(contacts).length);
          const contact = contacts[index];
          if (!completed[contact.id]) {
            const dataInGinger = await this.hubspotSearch.search('contacts', {
              filterGroups: [{
                filters: [{
                  propertyName: 'email',
                  operator: 'EQ',
                  value: contact.properties.email,
                }],
              }, ],
              properties: this.propsGingerToLookup.split(','),
            });

            if (dataInGinger.total > 0) {
              const {
                [0]: gingerObject
              } = dataInGinger.results;

              dataToUpdate.push({
                id: Number(dataInGinger.results[0]?.id),
                properties: await this.mapPropValue(gingerObject, contact)
              });
            } else {
              dataToInsert.push({
                properties: await this.mapObjectValue(contact)
              });
            }
          }
        } catch (error) {
          console.log(error)
        }
      }
      return Promise.resolve([dataToInsert, dataToUpdate]);
    } catch (error) {
      return Promise.reject(
        'Error in HubSpotContacts_BO.checkCompanyAndSetSeparateValues'
      );
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  static mapPropValue = async (objectGinger: Result, objectHFW: Result) => {
    const date1 = new Date(objectGinger.updatedAt),
      date2 = new Date(objectHFW.updatedAt);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let objectMapped: {
      [key: string]: any
    } = {};

    const HFWOwner = HubSpotOwners.getOwnerById(
      this.HFWOwners.results,
      objectHFW.properties.hubspot_owner_id
    );

    const gingerOwner = HubSpotOwners.getOwnerByEmail(
      this.gingerOwners.results,
      HFWOwner?.email as string
    );
    loop: for await (const key of Object.keys(objectGinger.properties)) {
      const mappingProp = mappingProps.filter((prop) => prop.key === key);
      if (mappingProp.length === 0) continue loop;
      const keyHFW =
        key in objectHFW.properties ?
        key :
        (mappingProp[0]?.hfwKey as string);
      const latest =
        date1 > date2 ?
        objectGinger.properties[key] :
        objectHFW.properties[keyHFW];
      const oldest =
        date1 < date2 ?
        objectGinger.properties[key] :
        objectHFW.properties[keyHFW];
      const biggest = +objectGinger.properties[key] > +objectHFW.properties[keyHFW] ? objectGinger.properties[key] : objectHFW.properties[keyHFW];
      const smallest = +objectGinger.properties[key] < +objectHFW.properties[keyHFW] ? objectGinger.properties[key] : objectHFW.properties[keyHFW];


      switch (mappingProp[0]?.operation) {
        case 'sum':
          objectMapped = {
            ...objectMapped,
            [key]:
              +objectGinger.properties[key] + +objectHFW.properties[keyHFW],
          };
          break;
        case 'latest':
          objectMapped = {
            ...objectMapped,
            [key]: latest
          };
          break;
        case 'oldest':
          objectMapped = {
            ...objectMapped,
            [key]: oldest,
          };
          break;
        case 'biggest':
          objectMapped = {
            ...objectMapped,
            [key]: biggest,
          };
          break;
        case 'smallest':
          objectMapped = {
            ...objectMapped,
            [key]: smallest,
          };
          break;
        default:
          objectMapped = {
            ...objectMapped,
            [key]: objectHFW.properties[keyHFW],
          };
          break;
      }

    }
    objectMapped['hubspot_owner_id'] = objectGinger.properties.hubspot_owner_id ? objectGinger.properties.hubspot_owner_id : gingerOwner?.id || null;
    objectMapped['headspace_for_work_id'] = objectHFW.id;
    return objectMapped;
  };

  static mapObjectValue = async (objectHFW: Result) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let objectMapped: {
      [key: string]: any
    } = {};
    const HFWOwner = HubSpotOwners.getOwnerById(
      this.HFWOwners.results,
      objectHFW.properties.hubspot_owner_id
    );

    const gingerOwner = HubSpotOwners.getOwnerByEmail(
      this.gingerOwners.results,
      HFWOwner?.email as string
    );
    loop: for await (const keyHFW of Object.keys(objectHFW.properties)) {

      const mappingProp = mappingProps.filter((prop) => prop.hfwKey === keyHFW);
      if (mappingProp.length === 0) continue loop;
      const key = mappingProp[0]?.key as string;

      objectMapped = {
        ...objectMapped,
        [key]: objectHFW.properties[keyHFW]
      };
    }
    objectMapped['hubspot_owner_id'] = gingerOwner?.id || null;
    objectMapped['headspace_for_work_id'] = objectHFW.id;
    return objectMapped;
  };

  static loadOwners = async () => {
    try {

      this.HFWOwners = await this.h4wOwnersInstance.getOwners();

      this.gingerOwners = await this.gingerOwnersInstance.getOwners();

    } catch (error) {
      Logger.error(error);
    }
  };

  static createBatchContact = async (instance: InstanceType < typeof HubSpotContacts > , dataToInsert: insertContact[]) => {
    try {
      if (dataToInsert.length === 0) return;

      const dataStored = await instance.insertContacts(dataToInsert);
      if (dataStored.length > 0) {
        console.log('starting associations');
        for (let index = 0; index < dataStored.length; index++) {
          const element = dataStored[index];
          await this.makeAssociations(element.results);
          this.storeCompletedElements(element.results);
        }

        Logger.debug('companies stored', {
          dataStored
        });
        // eslint-disable-next-line no-console
        console.log('companies stored');
      }
    } catch (error) {
      Utils.saveFile('_edataToInsert.json', JSON.stringify(dataToInsert));
    }
  };

  static updateBatchContact = async (instance: InstanceType < typeof HubSpotContacts > , dataToUpdate: updateContact[]) => {
    try {
      if (dataToUpdate.length === 0) return;

      const dataUpdated = await instance.updateContacts(dataToUpdate);
      if (dataUpdated.length > 0) {

        console.log('starting associations');
        for (let index = 0; index < dataUpdated.length; index++) {
          const element = dataUpdated[index];
          await this.makeAssociations(element.results);
          this.storeCompletedElements(element.results);
        }

        Logger.debug('companies updated', {
          dataUpdated
        });
        // eslint-disable-next-line no-console
        console.log('companies updated');
      }
    } catch (error) {
      Utils.saveFile('_edataToUpdate.json', JSON.stringify(dataToUpdate));
    }
  };

  static storeCompletedElements(data: Result[]) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const h4wElement = this.data[element.properties.headspace_for_work_id];
      if (h4wElement) {
        this.completed[h4wElement.id] = h4wElement.id;
        console.log('saving');
        fs.writeFileSync(path.join(cwd(), '/src/data', `contacts_done.json`), JSON.stringify(this.completed));
      }
    }
  }

  static async makeAssociations(data: Result[]) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const h4wElement = this.data[element.properties.headspace_for_work_id];
      if (h4wElement) {
        const companies = h4wElement.associated_companies;
        const {
          results
        } = await this.hubspotSearch.search('companies', {
          filterGroups: [{
            filters: [{
              propertyName: 'headspace_for_work_id',
              operator: 'IN',
              values: companies,
            }],
          }, ]
        });

        if (results.length > 0) {
          for (let index = 0; index < results.length; index++) {
            const company = results[index];
            const association = await this.hubspotAssociations.associateRecords({
              objectType: 'contacts',
              id: element.id
            }, {
              objectType: 'companies',
              id: company.id
            }, 'contact_to_company');
            console.log('association for contact %d completed with company %d', element.id, company.id);
          }
        }
      }
    }
  }
}

HubspotContacts_BO.init();