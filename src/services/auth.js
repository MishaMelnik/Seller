import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config';
import {API} from '../services';
import {UnauthorizedError} from '../services/utils';
import {logger} from 'react-native-logs';

export const USER_TYPES = {
  supervisor: 1,
  seller: 2,
};

export function authenticate(data) {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/${API.auth.login}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      response.json().then(json => {
        response.ok ? resolve(json) : reject(json);
      });
    });
  });
}

export async function login(token, user) {
  AsyncStorage.setItem('token', token);
  AsyncStorage.setItem('user', JSON.stringify(user));
}

export async function isLoggedIn() {
  return AsyncStorage.getItem('token').then(token => !!token);
}

export async function logout() {
  AsyncStorage.removeItem('token');
  AsyncStorage.removeItem('user');
  AsyncStorage.removeItem('lastStoreUpdate');
  AsyncStorage.removeItem('current_store');
}

export async function getUserType() {
  const log = logger.createLogger();
  return AsyncStorage.getItem('user')
    .then(json => JSON.parse(json))
    .then(user => {
      log.info('user', user);
      if (user) {
        return user.user_type;
      } else {
        throw new UnauthorizedError();
      }
    });
}

export function getUser() {
  return AsyncStorage.getItem('user')
    .then(json => JSON.parse(json))
    .then(user => {
      if (user) {
        return user;
      } else {
        throw new UnauthorizedError();
      }
    });
}

export function updateUser(user) {
  return AsyncStorage.setItem('user', JSON.stringify(user)).then(() => true);
}
