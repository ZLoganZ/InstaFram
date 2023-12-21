import axios from 'axios';

import { HEADER } from '@/lib/constants';

const DOMAIN_NAME = import.meta.env.VITE_SERVER_URL as string;

const headers = {
  'access-token': localStorage.getItem(HEADER.ACCESSTOKEN),
  'refresh-token': localStorage.getItem(HEADER.REFRESHTOKEN),
  'client-id': localStorage.getItem(HEADER.CLIENT_ID)
};

class BaseService {
  private request(method: string, url: string, data?: object | string, customHeaders?: object) {
    const requestHeaders = customHeaders ? { ...headers, ...customHeaders } : headers;
    const requestConfig = { headers: requestHeaders, data };
    const requestUrl = `${DOMAIN_NAME}/api/v1${url}`;
    return axios.request({ method, url: requestUrl, ...requestConfig });
  }

  get(url: string, model?: object | string) {
    return this.request('get', url, model);
  }

  post(url: string, model?: object | string) {
    return this.request('post', url, model);
  }

  put(url: string, model?: object | string) {
    return this.request('put', url, model);
  }

  delete(url: string, model?: object | string) {
    return this.request('delete', url, model);
  }
}

export default BaseService;
