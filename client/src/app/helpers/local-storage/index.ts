import { ACCESS_TOKEN, REFRESH_TOKEN } from 'app/constants';
import { isEmpty } from 'ramda';

/**
 * [setLocalStorage description]
 */
const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * [setLocalStorage description]
 */
const getLocalStorage = (key: string) => {
  const data =
    localStorage.getItem(key) !== 'undefined'
      ? JSON.parse(localStorage.getItem(key) || '{}')
      : JSON.parse('{}');

  return data;
};

/**
 * [removeLocalStorage description]
 */
const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

/**
 * [getJwtLocalStorage description]
 */
const getJwtLocalStorage = () => {
  const accessToken = getLocalStorage(ACCESS_TOKEN);
  return !isEmpty(accessToken) ? accessToken : null;
};

const getRefreshTokenLocalStorage = () => {
  const refreshToken = getLocalStorage(REFRESH_TOKEN);
  return !isEmpty(refreshToken) ? refreshToken : null;
};

export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  getJwtLocalStorage,
  getRefreshTokenLocalStorage,
};
