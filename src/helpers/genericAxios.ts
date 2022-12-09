import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Logger from "./genericLogger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processRequest = async <T = any>(
  params: AxiosRequestConfig
): Promise<T> => {
  try {
    Logger.info("processing Axios", { data: params });
    const { data }: AxiosResponse<T> = await axios(params);

    return Promise.resolve(data);
  } catch (error) {
    Logger.error("Error processing axios", { message: error });
    return Promise.reject(`Error ir processRequest message: ${error}`);
  }
};
