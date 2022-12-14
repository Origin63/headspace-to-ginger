import { AxiosRequestConfig } from 'axios';
import { processRequest } from '../helpers/genericAxios';
import { HSPayload, SearchResponse } from '../types/HS-Search';

type HSObjects =
  | 'companies'
  | 'tickets'
  | 'users'
  | 'contacts'
  | 'deals'
  | 'feedback_submissions'
  | 'products'
  | 'line_items'
  | 'quotes'
  | 'calls'
  | 'emails'
  | 'meetings'
  | 'notes'
  | 'tasks';

export default class HubSpotSearch {
  token: string;
  constructor(token: string) {
    this.token = token;
  }

  search = async (
    object: HSObjects,
    payload: HSPayload
  ): Promise<SearchResponse> => {
    try {
      const axiosRequest: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.HS_BASE_URL}/crm/v3/objects/${object}/search`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      };

      return Promise.resolve(
        await processRequest<SearchResponse>(axiosRequest)
      );
    } catch (error) {
      return Promise.reject(`Error in HubSpotSearch.search ${error}`);
    }
  };
}
