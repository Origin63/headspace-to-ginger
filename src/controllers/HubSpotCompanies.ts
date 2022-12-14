import { AxiosRequestConfig } from 'axios';
import { processRequest } from '../helpers/genericAxios';
import Utils from '../helpers/genericUtils';
import {
  InsertCompanies,
  UpdateCompanies,
  Properties,
} from '../types/HS-Companies';
import Pagination from '../types/HS-Pagination';
import { HSPayload, Result, SearchResponse } from '../types/HS-Search';

interface Companies extends Pagination {
  results: Result[];
}

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

export default class HubSpotCompanies {
  private path = 'crm/v3/objects/companies';
  private token: string;
  private accept = 'application/json';

  constructor(token: string) {
    this.token = token;
  }

  getCompanies = async (props?: string, after?: string): Promise<Companies> => {
    try {
      const axiosRequest: AxiosRequestConfig = {
        method: 'GET',
        url: `${process.env.HS_BASE_URL}/${this.path}`,
        params: {
          properties: props,
          after,
        },
        headers: {
          'Content-Type': this.accept,
          Authorization: `Bearer ${this.token}`,
        },
      };

      return Promise.resolve(await processRequest(axiosRequest));
    } catch (error) {
      return Promise.reject(`Error in HubSpotCompanies.getCompanies ${error}`);
    }
  };

  getCompany = async (id: number, props?: string): Promise<Properties> => {
    try {
      const axiosRequest: AxiosRequestConfig = {
        method: 'GET',
        url: `${process.env.HS_BASE_URL}/${this.path}/${id}`,
        params: {
          properties: props,
        },
        headers: {
          'Content-Type': this.accept,
          Authorization: `Bearer ${this.token}`,
        },
      };

      return Promise.resolve(await processRequest(axiosRequest));
    } catch (error) {
      return Promise.reject(`Error in HubSpotCompanies.getCompany ${error}`);
    }
  };

  insertCompanies = async (
    dataToInsert: InsertCompanies[]
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
            'Content-Type': this.accept,
            Authorization: `Bearer ${this.token}`,
          },
        };

        return await processRequest(axiosRequest);
      })
    );
  };

  updateCompanies = async (
    dataToUpdate: UpdateCompanies[]
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
            'Content-Type': this.accept,
            Authorization: `Bearer ${this.token}`,
          },
        };

        return await processRequest(axiosRequest);
      })
    );
  };

  search = async (payload: HSPayload): Promise<SearchResponse> => {
    try {
      await Utils.delay(1000);
      const axiosRequest: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.HS_BASE_URL}/crm/v3/objects/companies/search`,
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
      return Promise.reject(`Error in HubSpotCompanies.search ${error}`);
    }
  };
}
