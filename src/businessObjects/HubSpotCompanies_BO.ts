import HubSpotCompanies from '../controllers/HubSpotCompanies';
import HubSpotSearch from '../controllers/HubSpotSearch';
import Utils from '../helpers/genericUtils';
import { InsertCompanies, UpdateCompanies } from '../types/HS-Companies';
import { Result } from '../types/HS-Search';
import mappingProps from '../data/mappingProps.json';
import Logger from '../helpers/genericLogger';
import HubSpotOwners, { OwnersResult } from '../controllers/HubSpotOwners';

import { cwd } from 'process';
import { join } from 'path';
import { writeFileSync } from 'fs';

export default class HubSpotCompanies_BO {
  static propsGingerToLookup =
    'days_to_close,hs_analytics_first_timestamp,hs_analytics_first_touch_converting_campaign,hs_analytics_first_visit_timestamp,hs_analytics_last_timestamp,hs_analytics_last_touch_converting_campaign,hs_analytics_last_visit_timestamp,hs_analytics_num_page_views,hs_analytics_num_visits,hs_analytics_source,hs_analytics_source_data_1,hs_analytics_source_data_2,hs_lastmodifieddate,about_us,address,address2,annualrevenue,city,closedate,converted_total_won_recurring_revenue_,country,createdate,description,domain,engagements_last_meeting_booked,engagements_last_meeting_booked_campaign,engagements_last_meeting_booked_medium,engagements_last_meeting_booked_source,first_contact_createdate,first_deal_created_date,founded_year,hs_analytics_latest_source,hs_analytics_latest_source_data_1,hs_analytics_latest_source_data_2,hs_analytics_latest_source_timestamp,hs_created_by_user_id,hs_createdate,hs_last_booked_meeting_date,hs_last_logged_call_date,hs_last_open_task_date,hs_last_sales_activity_timestamp,hs_lead_status,hs_num_child_companies,hs_num_open_deals,hs_object_id,hs_parent_company_id,hs_predictivecontactscore_v2,hs_total_deal_value,hubspot_owner_assigneddate,hubspot_owner_id,hubspot_team_id,industry,is_public,lifecyclestage,name,notes_last_contacted,notes_last_updated,notes_next_activity_date,num_associated_contacts,num_associated_deals,num_contacted_notes,numberofemployees,phone,recent_deal_amount,recent_deal_close_date,send_headspace_is_coming_email,state,timezone,total_money_raised,total_revenue,type,web_technologies,website,zip,first_conversion_date,first_conversion_event_name,num_conversion_events,recent_conversion_date,recent_conversion_event_name,account_name_unique__c,account_owner_assigned_date__c,account_owner_role_name,account_priority__c,account_source_detail__c,active_users_last_30_days__c,active_users_last_7_days__c,ae_notes__c,alert_psm_pilot_email_sent__c,alias__c,allotted_service_credits__c,approved_footer_intl__c,arbitrary_checkbox_field_to_trigger_wfs__c,associatedterminusaccountsuptodateasof__c,auto_renew_opt_out_,available_client_channels__c,available_seats__c,benefits_start_date__c,bh_awareness__c,billing_country,billing_email__c,breakdown_by_role__c,budget__c,building_a_mindful_community_webinars__c,business_problem_objective__c,buyers__c,client_campaign_participation__c,client_care_plan__c,client_health_status__c,client_name_logo_use__c,client_requested_footer__c,client_tier__c,clinical_availability__c,clinical_benefits__c,clinical_persona__c,code__c,commercial_lives__c,common_stressors__c,company_overview__c,company_stage__c,contract_end__c,conversational_name__c,csm,current_enrolled_members__c,current_members__c,custom_type__c,days_until_renewal,dependents_covered__c,desk_worker__c,df_industry__c,df_sub_industry__c,django_account_name__c,do_not_contact__c,eap__c,ehir_cohorts__c,eligibility_file_frequency__c,eligibility_file_owner__c,eligibility_notes__c,eligible_population__c,email_footer__c,email_in_ef__c,email_url__c,email_verification_domain__c,employee_comm_channels__c,employee_lead_form_tier__c,employees_form__c,employer_hq__c,employer_internal_comms__c,employess__c,endofsurge__c,estimated_renewal_date__auto_populated_,executive_focus_account__c,female__c,first_closed_won_date,founded__c,gender_info__c,ginger_approved_footer_us__c,ginger_id,ginger_permission_to_email__c,ginger_type__c,global_account__c,has_landing_page__c,has_redemption_opp__c,headline__c,health_plan_tier__c,health_score__c,highestsurgepercent__c,history_of_lead__c,hold_account_ae__c,incentives__c,incident_notification_requirement__c,individual_lives__c,industry_details__c,insurance_carrier_more_detail__c,insurance_carriers__c,international_region__c,interview_with_media_press__c,intl_expat__c,intl_native__c,invitations_to_be_interviewed_for_a_head__c,is_ginger_customer,landing_page__c,last_activity_date_adjusted__c,last_client_health_update_task__c,lastuniquevisitorssnapshot__c,lastvisitmoment__c,lastvisitsessionssnapshot__c,latest_survey_2_sent__c,latest_survey_3_sent__c,launch_date__c,launch_webinars__c,lead_owner_name__c,leadgenius_employee_range__c,leadgenius_industry__c,leadgenius_revenue_range__c,length_of_last_opportunity_months__c,length_of_time_months__c,linkedin_account__c,linkedin_url__c,logo_location__c,logo_marketing_materials__c,logo_on_headspace_website__c,logo_on_sales_materials__c,lpe_url__c,male__c,medicaid_lives__c,medicare_lives__c,meditations_completed_last_30_days__c,meditations_completed_ytd__c,meditations_last_7_days__c,members_added_last_30_days__c,members_added_lifetime__c,members_added_ytd__c,mention_name_online_advertising__c,mention_relationship_in_media_press__c,monthly_active_user__c,months_as_a_customer__c,most_important_take_aways__c,most_recent_customer_tier__c,most_recent_new_biz_or_renewal_amount__c,most_recent_opportunity_is_a_bundle,most_recent_products_sold__c,naics_description__c,nationality__c,new_hire_emails__c,no_dependent_codes__c,no_dependents_covered__c,no_of_contact_made__c,non_binary__c,non_desk_worker__c,non_member_comms__c,non_profit_tax_id__c,number_of_administrators__c,number_of_closed_won_opps,number_of_voucher_codes__c,of_customers__c,on_site_launch_presentations__c,on_site_meditation_sessions__c,onboarding_process__c,org_country__c,org_id__c,other_benefits__c,other_comm_channel__c,other_eap_detail__c,other_footer__c,other_lives__c,other_notes__c,other_vendor_solution_details__c,others_details__c,override_customer_tier__c,override_headspace_org__c,partner_client__c,partner_tier__c,partner_type__c,percent_through_term__c,performance_goals__c,plans__c,possible_use_cases_why_it_s_a_good_fit__c,primary_broker__c,priorities_goals__c,product_lines_purchased__c,product_min_start,psm_assigned_date__c,psm_notes__c,recent_news_trends__c,reference__c,reference_contact__c,reference_date__c,reference_externally__c,referred_by__c,renewable_amount__c,renewal_date_psm_entered__c,renewal_date_workflow_stamped__c,restricted_dependents__c,revenue_range__c,salesforce_customer_tier,salesforceaccountid,salesforcelastsynctime,sdr_meeting_set_with_lead__c,send_welcome_emails,send_welcome_emails__all_,send_welcome_emails_internal_,service_launch_new__c,services_to_be_launched__c,sign_up_code__c,site,social_media_reference__c,spanish_preferred__c,spanish_preferred_details__c,speak_on_behalf_of_headspace__c,speak_with_prospective_customers__c,specifics_on_lead_source__c,subsidiary__c,success_failures__c,target_account_2019__c,target_account__c,tax_id__c,team_all_hands_presentation_webinar__c,tech_savviness__c,terminusaccountlists__c,terminusaccountlistsupdatedmomentutc__c,themed_webinars__c,third_party_administrator__c,title_match_accounts__c,total_active_revenue__c,total_active_seat_months__c,total_active_seats__c,total_covered_lives__c,total_won_recurring_revenue__c,trending_intent__c,twitter_handle__c,type_of_employer__c,type_of_plan__c,uniquewebvisitorsrolling30__c,us_only_account__c,virtual_meditation_session__c,voluntary_benefits__c,webvisitdatauptodateasof__c,webvisitsrolling30__c,what_of_covered_lives_own_a_smartphone__c,whitelisting_it_contact__c,worker_type__c,facebook_company_page,facebookfans,googleplus_page,linkedin_company_page,linkedinbio,twitterbio,twitterfollowers,twitterhandle,hs_ideal_customer_profile,hs_is_target_account,hs_num_blockers,hs_num_contacts_with_buying_roles,hs_num_decision_makers,age_groups__corrected_,english_as_a_2nd_language__corrected_,income_levels__corrected_,campaign__c,abm_opt_in,auto_price_increase_5__c,auto_renew__c,total_minutes_meditated_lifetime__c,meditations_completed_lifetime__c,account_status,alert_psm_email_sent__c,send_pilot_welcome_emails_all__c,send_pilot_welcome_emails_drip__c,send_pre_launch_email__c,headspace_org_location_reporting,territory__c,naics_code__corrected_,date_last_onboard_mail_sent__c,do_not_send_renewal_emails__c,enrollment_email_language__c,onboard_emails_sent__c,publicity_rights__c,renewal_url__c,sync_to_hubspot__account_';

  static propsHFWToLookUp =
    'days_to_close,hs_analytics_first_timestamp,hs_analytics_first_touch_converting_campaign,hs_analytics_first_visit_timestamp,hs_analytics_last_timestamp,hs_analytics_last_touch_converting_campaign,hs_analytics_last_visit_timestamp,hs_analytics_num_page_views,hs_analytics_num_visits,hs_analytics_source,hs_analytics_source_data_1,hs_analytics_source_data_2,hs_lastmodifieddate,about_us,address,address2,annualrevenue,city,closedate,converted_total_won_recurring_revenue_,country,createdate,description,domain,engagements_last_meeting_booked,engagements_last_meeting_booked_campaign,engagements_last_meeting_booked_medium,engagements_last_meeting_booked_source,first_contact_createdate,first_deal_created_date,founded_year,hs_analytics_latest_source,hs_analytics_latest_source_data_1,hs_analytics_latest_source_data_2,hs_analytics_latest_source_timestamp,hs_created_by_user_id,hs_createdate,hs_last_booked_meeting_date,hs_last_logged_call_date,hs_last_open_task_date,hs_last_sales_activity_timestamp,hs_lead_status,hs_num_child_companies,hs_num_open_deals,hs_object_id,hs_parent_company_id,hs_predictivecontactscore_v2,hs_total_deal_value,hubspot_owner_assigneddate,hubspot_owner_id,hubspot_team_id,industry,is_public,lifecyclestage,name,notes_last_contacted,notes_last_updated,notes_next_activity_date,num_associated_contacts,num_associated_deals,num_contacted_notes,numberofemployees,phone,recent_deal_amount,recent_deal_close_date,send_headspace_is_coming_email,state,timezone,total_money_raised,total_revenue,type,web_technologies,website,zip,first_conversion_date,first_conversion_event_name,num_conversion_events,recent_conversion_date,recent_conversion_event_name,account_name_unique__c,account_owner_assigned_date__c,account_owner_role_name,account_priority__c,account_source_detail__c,active_users_last_30_days__c,active_users_last_7_days__c,ae_notes__c,alert_psm_pilot_email_sent__c,alias__c,allotted_service_credits__c,approved_footer_intl__c,arbitrary_checkbox_field_to_trigger_wfs__c,associatedterminusaccountsuptodateasof__c,auto_renew_opt_out_,available_client_channels__c,available_seats__c,benefits_start_date__c,bh_awareness__c,billing_country,billing_email__c,breakdown_by_role__c,budget__c,building_a_mindful_community_webinars__c,business_problem_objective__c,buyers__c,client_campaign_participation__c,client_care_plan__c,client_health_status__c,client_name_logo_use__c,client_requested_footer__c,client_tier__c,clinical_availability__c,clinical_benefits__c,clinical_persona__c,code__c,commercial_lives__c,common_stressors__c,company_overview__c,company_stage__c,contract_end__c,conversational_name__c,csm,current_enrolled_members__c,current_members__c,custom_type__c,days_until_renewal,dependents_covered__c,desk_worker__c,df_industry__c,df_sub_industry__c,django_account_name__c,do_not_contact__c,eap__c,ehir_cohorts__c,eligibility_file_frequency__c,eligibility_file_owner__c,eligibility_notes__c,eligible_population__c,email_footer__c,email_in_ef__c,email_url__c,email_verification_domain__c,employee_comm_channels__c,employee_lead_form_tier__c,employees_form__c,employer_hq__c,employer_internal_comms__c,employess__c,endofsurge__c,estimated_renewal_date__auto_populated_,executive_focus_account__c,female__c,first_closed_won_date,founded__c,gender_info__c,ginger_approved_footer_us__c,ginger_id,ginger_permission_to_email__c,ginger_type__c,global_account__c,has_landing_page__c,has_redemption_opp__c,headline__c,health_plan_tier__c,health_score__c,highestsurgepercent__c,history_of_lead__c,hold_account_ae__c,incentives__c,incident_notification_requirement__c,individual_lives__c,industry_details__c,insurance_carrier_more_detail__c,insurance_carriers__c,international_region__c,interview_with_media_press__c,intl_expat__c,intl_native__c,invitations_to_be_interviewed_for_a_head__c,is_ginger_customer,landing_page__c,last_activity_date_adjusted__c,last_client_health_update_task__c,lastuniquevisitorssnapshot__c,lastvisitmoment__c,lastvisitsessionssnapshot__c,latest_survey_2_sent__c,latest_survey_3_sent__c,launch_date__c,launch_webinars__c,lead_owner_name__c,leadgenius_employee_range__c,leadgenius_industry__c,leadgenius_revenue_range__c,length_of_last_opportunity_months__c,length_of_time_months__c,linkedin_account__c,linkedin_url__c,logo_location__c,logo_marketing_materials__c,logo_on_headspace_website__c,logo_on_sales_materials__c,lpe_url__c,male__c,medicaid_lives__c,medicare_lives__c,meditations_completed_last_30_days__c,meditations_completed_ytd__c,meditations_last_7_days__c,members_added_last_30_days__c,members_added_lifetime__c,members_added_ytd__c,mention_name_online_advertising__c,mention_relationship_in_media_press__c,monthly_active_user__c,months_as_a_customer__c,most_important_take_aways__c,most_recent_customer_tier__c,most_recent_new_biz_or_renewal_amount__c,most_recent_opportunity_is_a_bundle,most_recent_products_sold__c,naics_description__c,nationality__c,new_hire_emails__c,no_dependent_codes__c,no_dependents_covered__c,no_of_contact_made__c,non_binary__c,non_desk_worker__c,non_member_comms__c,non_profit_tax_id__c,number_of_administrators__c,number_of_closed_won_opps,number_of_voucher_codes__c,of_customers__c,on_site_launch_presentations__c,on_site_meditation_sessions__c,onboarding_process__c,org_country__c,org_id__c,other_benefits__c,other_comm_channel__c,other_eap_detail__c,other_footer__c,other_lives__c,other_notes__c,other_vendor_solution_details__c,others_details__c,override_customer_tier__c,override_headspace_org__c,partner_client__c,partner_tier__c,partner_type__c,percent_through_term__c,performance_goals__c,plans__c,possible_use_cases_why_it_s_a_good_fit__c,primary_broker__c,priorities_goals__c,product_lines_purchased__c,product_min_start,psm_assigned_date__c,psm_notes__c,recent_news_trends__c,reference__c,reference_contact__c,reference_date__c,reference_externally__c,referred_by__c,renewable_amount__c,renewal_date_psm_entered__c,renewal_date_workflow_stamped__c,restricted_dependents__c,revenue_range__c,salesforce_customer_tier,salesforceaccountid,salesforcelastsynctime,sdr_meeting_set_with_lead__c,send_welcome_emails,send_welcome_emails__all_,send_welcome_emails_internal_,service_launch_new__c,services_to_be_launched__c,sign_up_code__c,site,social_media_reference__c,spanish_preferred__c,spanish_preferred_details__c,speak_on_behalf_of_headspace__c,speak_with_prospective_customers__c,specifics_on_lead_source__c,subsidiary__c,success_failures__c,target_account_2019__c,target_account__c,tax_id__c,team_all_hands_presentation_webinar__c,tech_savviness__c,terminusaccountlists__c,terminusaccountlistsupdatedmomentutc__c,themed_webinars__c,third_party_administrator__c,title_match_accounts__c,total_active_revenue__c,total_active_seat_months__c,total_active_seats__c,total_covered_lives__c,total_won_recurring_revenue__c,trending_intent__c,twitter_handle__c,type_of_employer__c,type_of_plan__c,uniquewebvisitorsrolling30__c,us_only_account__c,virtual_meditation_session__c,voluntary_benefits__c,webvisitdatauptodateasof__c,webvisitsrolling30__c,what_of_covered_lives_own_a_smartphone__c,whitelisting_it_contact__c,worker_type__c,facebook_company_page,facebookfans,googleplus_page,linkedin_company_page,linkedinbio,twitterbio,twitterfollowers,twitterhandle,hs_ideal_customer_profile,hs_is_target_account,hs_num_blockers,hs_num_contacts_with_buying_roles,hs_num_decision_makers,age_groups__c,english_as_a_2nd_language__c,income_levels__c,campaign__account_,abm_opt_in__c,price_increase_5_,auto_renew_account,company_minutes_meditated,company_meditations_completed__lifetime_,account_status__c,alert_csm_email_sent,send_pilot_welcome_emails_all_,send_pilot_welcome_emails_drip_,send_pre_launch_email,headspace_org,account_territory_c,naics_code__c,date_last_onboard_mail_sent,do_not_send_renewal_emails,enrollment_email_language,onboard_emails_sent,publicity_rights,renewal_url,sync_to_hubspot_account__c';

  static HFWOwners: OwnersResult;
  static gingerOwners: OwnersResult;
  static hfwCompanies: InstanceType<typeof HubSpotCompanies>;
  static gingerCompanies: InstanceType<typeof HubSpotCompanies>;
  static gingerSearch: InstanceType<typeof HubSpotSearch>;
  static hfwOwnersInstance: InstanceType<typeof HubSpotOwners>;
  static gingerOwnersInstance: InstanceType<typeof HubSpotOwners>;
  static allCompanies: Result[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static companies: any;

  static loadInstances() {
    this.hfwCompanies = new HubSpotCompanies(process.env.HFW_TOKEN as string);
    this.hfwOwnersInstance = new HubSpotOwners(process.env.HFW_TOKEN as string);

    this.gingerCompanies = new HubSpotCompanies(
      process.env.GINGER_TOKEN as string
    );
    this.gingerSearch = new HubSpotSearch(process.env.GINGER_TOKEN as string);
    this.gingerOwnersInstance = new HubSpotOwners(
      process.env.GINGER_TOKEN as string
    );
  }

  static async loadData() {
    try {
      this.companies = Utils.readJsonFile(
        join(cwd(), 'storage/data/companies.json')
      );

      this.HFWOwners = await this.hfwOwnersInstance.getOwners();

      this.gingerOwners = await this.gingerOwnersInstance.getOwners();
    } catch (error) {
      Logger.error(error);
    }
  }

  static async migrateCompanies(): Promise<void> {
    try {
      const completed = await this.processMigration(this.allCompanies);
      // eslint-disable-next-line no-console
      completed && console.log('all companies were migrated');
    } catch (error) {
      Logger.error('Error in HubSpotCompanies_BO.migrateCompanies', {
        message: error,
      });
    }
  }

  static async fetchAllCompanies(after?: string): Promise<boolean> {
    try {
      if (!after && this.companies) {
        this.allCompanies.push(...this.companies.companies);
        if (!('paging' in this.companies)) return this.companies;
        after = this.companies.paging.next.after;
      }

      const { results, paging } = await this.hfwCompanies.getCompanies(
        this.propsHFWToLookUp,
        after
      );
      const companiesWithProperDataSet = results.filter(
        (company) => company.properties.domain && company.properties.industry
      );
      this.allCompanies.push(...companiesWithProperDataSet);
      /*writeFileSync(
        join(cwd(), '/storage/data/companies.json'),
        JSON.stringify({ companies: this.allCompanies, paging })
      );*/
      // eslint-disable-next-line no-console
      console.log('%d companies stored', this.allCompanies.length);

      if (paging) {
        await this.fetchAllCompanies(paging.next.after);
      }

      return Promise.resolve(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in HubSpotCompanies_BO.fetchAllCompanies', error);
      Logger.error('Error in HubSpotCompanies_BO.fetchAllCompanies', {
        message: error,
      });
      return Promise.reject(false);
    }
  }

  static async processMigration(companies: Result[]) {
    const companiesChunked = Utils.getDataChunked(companies, 100);
    let count = 0;
    for (let index = 0; index < companiesChunked.length; index++) {
      try {
        const companies = companiesChunked[index];
        count += companies.length;
        // eslint-disable-next-line no-console
        console.log('companies reached %d', count);
        const [dataToInsert, dataToUpdate] =
          await this.checkCompanyAndSetSeparateValues(companies);

        dataToInsert.length > 0 &&
          (await this.createBatchCompany(dataToInsert));

        dataToUpdate.length > 0 &&
          (await this.updateBatchCompany(dataToUpdate));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'Error in HubSpotCompanies_BO.migrateCompanies processing companies',
          error
        );
        Logger.error(
          'Error in HubSpotCompanies_BO.migrateCompanies processing companies',
          {
            message: error,
          }
        );
      }
    }
    return Promise.resolve(true);
  }

  static async checkCompanyAndSetSeparateValues(
    companies: Result[]
  ): Promise<[InsertCompanies[], UpdateCompanies[]]> {
    try {
      const dataToInsert: InsertCompanies[] = [];
      const dataToUpdate: UpdateCompanies[] = [];

      for (let index = 0; index < companies.length; index++) {
        // eslint-disable-next-line no-console
        console.log('processing %d of %d', index, companies.length);
        const company = companies[index];
        await Utils.delay(300);

        const dataInGinger = await this.gingerSearch.search('companies', {
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'domain',
                  operator: 'EQ',
                  value: company.properties.domain,
                },
                {
                  propertyName: 'industry',
                  operator: 'EQ',
                  value: company.properties.industry,
                },
              ],
            },
          ],
          properties: this.propsGingerToLookup.split(','),
        });
        if (dataInGinger.total > 0) {
          const { [0]: gingerObject } = dataInGinger.results;
          const exists = dataToUpdate.filter(
            (data) => data.id === +gingerObject.id
          );
          if (exists.length === 0) {
            dataToUpdate.push({
              id: Number(gingerObject.id),
              properties: await this.mapPropValue(gingerObject, company),
            });
          }
        } else {
          dataToInsert.push({ properties: await this.mapObjectValue(company) });
        }
      }
      return Promise.resolve([dataToInsert, dataToUpdate]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Error in HubSpotCompanies_BO.checkCompanyAndSetSeparateValues',
        error
      );
      return Promise.reject(
        'Error in HubSpotCompanies_BO.checkCompanyAndSetSeparateValues'
      );
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  static async mapPropValue(objectGinger: Result, objectHFW: Result) {
    const date1 = new Date(objectGinger.updatedAt),
      date2 = new Date(objectHFW.updatedAt);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let objectMapped: { [key: string]: any } = {};

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
        key in objectHFW.properties
          ? key
          : (mappingProp.at(0)?.hfwKey as string);
      const latest =
        date1 > date2
          ? objectGinger.properties[key]
          : objectHFW.properties[keyHFW];
      const oldest =
        date1 < date2
          ? objectGinger.properties[key]
          : objectHFW.properties[keyHFW];

      switch (mappingProp.at(0)?.operation) {
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
            [key]: latest === 'PROSPECT' ? 'Prospect' : latest,
          };
          break;
        case 'oldest':
          objectMapped = {
            ...objectMapped,
            [key]: oldest === 'PROSPECT' ? 'Prospect' : oldest,
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
    objectMapped['hubspot_owner_id'] = objectGinger.properties.hubspot_owner_id
      ? objectGinger.properties.hubspot_owner_id
      : gingerOwner?.id || process.env.GINGER_DEFAULT_OWNER;
    objectMapped['headspace_for_work_id'] = objectHFW.id;
    objectMapped['o63__companies_for_migration'] = true;
    return objectMapped;
  }

  static async mapObjectValue(objectHFW: Result) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let objectMapped: { [key: string]: any } = {};
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
      const key = mappingProp.at(0)?.key as string;

      objectMapped = {
        ...objectMapped,
        [key]:
          objectHFW.properties[keyHFW] === 'PROSPECT'
            ? 'Prospect'
            : objectHFW.properties[keyHFW],
      };
    }
    objectMapped['hubspot_owner_id'] =
      gingerOwner?.id || process.env.GINGER_DEFAULT_OWNER;
    objectMapped['headspace_for_work_id'] = objectHFW.id;
    objectMapped['o63__companies_for_migration'] = true;
    return objectMapped;
  }

  static async createBatchCompany(dataToInsert: InsertCompanies[]) {
    try {
      const dataStored = await this.gingerCompanies.insertCompanies(
        dataToInsert
      );
      if (dataStored.length > 0) {
        Logger.debug('companies stored', { dataStored });
        // eslint-disable-next-line no-console
        console.log('companies stored');
        return Promise.resolve(true);
      }
    } catch (error) {
      Utils.saveFile('error/dataToInsert.json', JSON.stringify(dataToInsert));
      return Promise.reject(error);
    }
  }

  static async updateBatchCompany(dataToUpdate: UpdateCompanies[]) {
    try {
      const dataUpdated = await this.gingerCompanies.updateCompanies(
        dataToUpdate
      );
      if (dataUpdated.length > 0) {
        Logger.debug('companies updated', { dataUpdated });
        // eslint-disable-next-line no-console
        console.log('companies updated');
        return Promise.resolve(true);
      }
    } catch (error) {
      Utils.saveFile('error/dataToUpdate.json', JSON.stringify(dataToUpdate));
      return Promise.reject(error);
    }
  }
}
