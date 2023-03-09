import React, {Component} from 'react';
import {Text, View} from 'react-native';

import {MotivationBlock} from './MotivationBlock';

import {t} from '../services/i18n';

import {HEIGHT} from '../services';

import theme from '../styles';

export class HappyAlert extends Component {
  render() {
    const {showHappyAlert, type, currentStore} = this.props;

    if (!showHappyAlert) {
      return null;
    }

    if (type === 'end_day') {
      return (
        <View style={[theme.alertWrapper, {height: HEIGHT}]}>
          <View style={theme.alertContainer}>
            <Text style={[theme.alertDefText, theme.alertTextHeader]}>
              {t('Thank you for your work!')}
            </Text>
            <Text style={theme.alertDefText}>{t('Have a nice day')}</Text>
            <MotivationBlock currentStore={currentStore} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={[theme.alertWrapper, {height: HEIGHT}]}>
          <View style={theme.alertContainer}>
            <Text style={[theme.alertDefText, theme.alertTextHeader]}>
              {t('Good morning!')}
            </Text>
            <Text style={theme.alertDefText}>{t('Happy working day')}</Text>
            <MotivationBlock currentStore={currentStore} />
          </View>
        </View>
      );
    }
  }
}
