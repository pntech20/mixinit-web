import { ACCESS_TOKEN, REFRESH_TOKEN } from 'app/constants';
import {
  getJwtLocalStorage,
  getRefreshTokenLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from 'app/helpers/local-storage';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getTokenFromRefreshToken } from 'app/apis/auth/refresh-token';

class AxiosService {
  private service: AxiosInstance;
  constructor() {
    const JWT = getJwtLocalStorage();
    const refreshTokenLocal = getRefreshTokenLocalStorage();

    const service = axios.create({
      baseURL: process.env.REACT_APP_URL_API,
      headers: {},
    });

    let refreshTokenRequest: any = null;
    service.interceptors.request.use(async function (config) {
      if (!!JWT) {
        config.headers = {
          Authorization: `Bearer ${JWT}`,
        };
      }

      if (!JWT) return config;
      const user: any = jwt_decode(JWT);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      if (!isExpired) return config;

      refreshTokenRequest =
        refreshTokenRequest || getTokenFromRefreshToken(refreshTokenLocal);
      const getNewToken = await refreshTokenRequest;
      refreshTokenRequest = null;
      const newAccessToken = getNewToken?.data?.data?.accessToken;
      setLocalStorage(ACCESS_TOKEN, newAccessToken);
      config.headers = {
        Authorization: `Bearer ${newAccessToken}`,
      };

      return config;
    });
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  setHeader(name: string, value: any) {
    this.service.defaults.headers.common[name] = value;
  }

  removeHeader(name: string) {
    delete this.service.defaults.headers.common[name];
  }

  handleSuccess(response: any) {
    return response;
  }

  redirectToLogin() {
    localStorage.setItem('subApp', window.location.href);
    localStorage.setItem('services', window.location.pathname);
    if (window?.location?.pathname !== '/auth/login') {
      window.location.href = '/auth/login';
      removeLocalStorage(ACCESS_TOKEN);
      removeLocalStorage(REFRESH_TOKEN);
    }
  }

  handleError = (error: any) => {
    const caseToRedirectLogin = ['Invalid token.', 'User Not Found'];

    if (caseToRedirectLogin.includes(error.response?.data?.message)) {
      this.redirectToLogin();
    }

    switch (error?.response?.status) {
      case 401:
        this.redirectToLogin();
        break;
      default:
        return Promise.reject(error);
    }
  };

  redirectTo = (document: any, path: string) => {
    document.location = path;
  };

  get(endpoint: string, config?: AxiosRequestConfig<any>) {
    return this.service.get(endpoint, config);
  }

  post(endpoint: string, payload: any, config?: AxiosRequestConfig<any>) {
    return this.service.post(endpoint, payload, config);
  }

  put(endpoint: string, payload?: any, config?: AxiosRequestConfig<any>) {
    return this.service.put(endpoint, payload, config);
  }

  patch(endpoint: string, payload?: any, config?: AxiosRequestConfig<any>) {
    return this.service.patch(endpoint, payload, config);
  }

  delete(endpoint: string) {
    return this.service.delete(endpoint);
  }
}

export default new AxiosService();
