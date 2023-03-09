import React, {Component} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

import {t} from '../services/i18n';

export class LoadMore_Btn extends Component {
  render() {
    const {pressEvent, next_bool} = this.props;

    if (!next_bool) {
      return null;
    }
    return (
      <TouchableOpacity onPress={pressEvent} style={styles.loadMoreBtn}>
        <Text style={styles.loadMoreBtnText}>{t('Load more')}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  loadMoreBtn: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#209e41',
    padding: 10,
    borderRadius: 7,
  },
  loadMoreBtnText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
  },
});
