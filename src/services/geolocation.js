import {Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';

export function getLocation() {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'ios') {
      NetInfo.fetch().then(isConnected => {
        if (isConnected) {
          Geolocation.getCurrentPosition(position => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          });
        }
      });
    } else {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          reject(error);
        },
      );
    }
  });
}
