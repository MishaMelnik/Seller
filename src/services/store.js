import AsyncStorage from '@react-native-async-storage/async-storage';

import moment from 'moment/moment';
import {getLocation} from './geolocation';
import {createObjectWithResponse, fetchList, updateObjectPATCH} from './utils';
import {API} from './index';

export function setStore(data) {
  return getLocation()
    .then(location => {
      const body = {
        store: data.store,
        photo: data.photo,
        // lng: location.lng,
        // lat: location.lat,
        lng: 49.89928,
        lat: 28.60235,
      };

      return createObjectWithResponse(API.seller.stores.visit, body).then(
        visit => {
          AsyncStorage.setItem('lastStoreUpdate', moment().format('YYYYMMDD'));
          return visit;
        },
      );
    })
    .catch(error => {
      console.warn('MY WARN:', error);
      return Promise.reject(error);
    });
}

export function setStoreCloseDay(data, id) {
  return getLocation()
    .then(location => {
      const body = {
        closing_photo: data.photo,
        lng: location.lng,
        lat: location.lat,
      };
      return updateObjectPATCH(API.seller.stores, body, id).then(visit => {
        return visit;
      });
    })
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
}

export function getStores() {
  return fetchList(API.seller.stores.list);
}

export function setCurrentStore(store) {
  AsyncStorage.setItem('current_store', JSON.stringify(store));
}

export function getCurrentStore() {
  return AsyncStorage.getItem('current_store')
    .then(json => JSON.parse(json))
    .then(store => store);
}

export function deleteCurrentStore() {
  AsyncStorage.removeItem('current_store');
}

export function deleteLastStoreUpdate() {
  AsyncStorage.removeItem('lastStoreUpdate');
}
