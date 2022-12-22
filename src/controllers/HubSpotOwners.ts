import { AxiosRequestConfig } from 'axios';
import Pagination from '../types/HS-Pagination';
import { processRequest } from '../helpers/genericAxios';
import * as dotenv from 'dotenv';

interface Owner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  teams: Team[];
}

interface Team {
  id: string;
  name: string;
  primary: boolean;
}

export interface OwnersResult extends Pagination {
  results: Owner[];
}

export default class HubSpotOwners {
  private token: string;
  private path = 'crm/v3/owners';

  constructor(token: string) {
    this.token = token;
  }

  public getOwners = () => {
    const axiosRequest: AxiosRequestConfig = {
      method: 'GET',
      url: `${process.env.HS_BASE_URL}/${this.path}`,
      params: {
        limit: 500,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    };
    return processRequest<OwnersResult>(axiosRequest);
  };

  static getOwnerByEmail(owners: Owner[], email: string): Owner | undefined {
    return owners
      .filter((owner) => {
        let localEmail = owner.email;
        const arrEmail = owner.email.split('.');
        if (arrEmail.includes('invalid')) {
          arrEmail.splice(
            arrEmail.findIndex((element) => element === 'invalid'),
            1
          );
          localEmail = arrEmail.join('.');
        }
        return localEmail === email;
      })
      .shift();
  }

  static getOwnerById(owners: Owner[], id: string): Owner | undefined {
    return owners.filter((owner) => owner.id === id).shift();
  }
}
