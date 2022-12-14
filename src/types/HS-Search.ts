/* eslint-disable @typescript-eslint/no-explicit-any */
type FilterGroup = {
  filters: Filter[];
};

type Filter = {
  propertyName: string;
  operator:
    | 'LT'
    | 'LTE'
    | 'GT'
    | 'GTE'
    | 'EQ'
    | 'NEQ'
    | 'BETWEEN'
    | 'IN'
    | 'NOT_IN'
    | 'HAS_PROPERTY'
    | 'NOT_HAS_PROPERTY'
    | 'CONTAINS_TOKEN'
    | 'NOT_CONTAINS_TOKEN';
  highValue?: string;
  value?: string | number;
};

type Sort = {
  propertyName: string;
  direction: string;
};

export type HSPayload = {
  filterGroups: FilterGroup[];
  sorts?: Sort[];
  query?: string;
  properties?: string[];
  limit?: number;
  after?: number;
};

export type SearchResponse = {
  total: number;
  results: Result[];
};

export type Result = {
  id: string;
  properties: Properties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
};

type Properties = {
  [key: string]: any;
};
