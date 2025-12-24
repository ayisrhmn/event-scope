export interface BaseApiOptions {
  baseURL?: string;
}

export type BaseApiResult<T> = {
  data: T;
  message: string;
  status: number;
};
