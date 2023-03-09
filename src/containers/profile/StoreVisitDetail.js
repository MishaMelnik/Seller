import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';

import Loader from '../../components/Loader';

import {API, fetchDetails} from '../../services';
import {t} from '../../services/i18n';

import Logo from '../../images/logo.png';
import moment from 'moment/moment';

export class StoreVisitDetail extends Component {
  state = {
    data: {},
    isLoading: true,
  };

  componentDidMount() {
    const {navigation} = this.props;
    fetchDetails(API.supervisor.stores.visits, navigation.getParam('visitId'))
      .then(response => {
        this.setState({
          data: response,
          isLoading: false,
        });
      })
      .catch(error => console.warn('error', error));
  }

  getUserName(item) {
    if (item.first_name.length && item.last_name.length) {
      return `${item.first_name} ${item.last_name}`;
    } else {
      return item.phone;
    }
  }

  render() {
    const {data, isLoading} = this.state;
    const {visitor} = data;

    const showEndDay =
      !!data.closing_address && !!data.closing_date && !!data.closing_photo;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <ScrollView>
        <View style={styles.detailHeader}>
          <Text style={styles.textHeader}>{this.getUserName(visitor)}</Text>
        </View>
        <View style={styles.partOfDetail}>
          <View style={[styles.titleOfPart, {backgroundColor: '#008000'}]}>
            <Text style={[styles.defFont, {color: '#fff'}]}>
              {t('The beginning of the work day')}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.section,
            {borderTopLeftRadius: 7, borderTopRightRadius: 7},
          ]}>
          <Text style={styles.detailLabel}>{t('A store')}</Text>
          <View style={styles.row_container}>
            <Image
              source={
                Platform.OS === 'ios'
                  ? Logo
                  : {uri: 'asset:/images/logo_android.png'}
              }
              style={styles.logo_image}
            />
            <Text style={styles.defFont}>{data.store.title}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.detailLabel}>{t('Time')}</Text>
          <Text style={styles.defFont}>
            {moment(data.date).format('HH:mm')}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.detailLabel}>{t('Address')}</Text>
          <Text style={styles.defFont}>{data.address}</Text>
        </View>
        <View
          style={[
            styles.section,
            {
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomLeftRadius: 7,
              borderBottomRightRadius: 7,
              marginBottom: 20,
            },
          ]}>
          <Image
            source={{uri: data.photo}}
            resizeMode={'contain'}
            style={styles.detailPhoto}
          />
        </View>

        {showEndDay ? (
          <View style={{marginBottom: 20, marginTop: -10}}>
            <View style={[styles.partOfDetail]}>
              <View style={[styles.titleOfPart, {backgroundColor: '#ff0000'}]}>
                <Text style={[styles.defFont, {color: '#fff'}]}>
                  {t('The end of the working day')}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.section,
                {borderTopLeftRadius: 7, borderTopRightRadius: 7},
              ]}>
              <Text style={styles.detailLabel}>{t('A store')}</Text>
              <View style={styles.row_container}>
                <Image
                  source={
                    Platform.OS === 'ios'
                      ? Logo
                      : {uri: 'asset:/images/logo_android.png'}
                  }
                  style={styles.logo_image}
                />
                <Text style={styles.defFont}>{data.store.title}</Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.detailLabel}>{t('Time')}</Text>
              <Text style={styles.defFont}>
                {moment(data.closing_date).format('HH:mm')}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.detailLabel}>{t('Address')}</Text>
              <Text style={styles.defFont}>{data.closing_address}</Text>
            </View>
            <View
              style={[
                styles.section,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomLeftRadius: 7,
                  borderBottomRightRadius: 7,
                },
              ]}>
              <Image
                source={{uri: data.closing_photo}}
                resizeMode={'contain'}
                style={styles.detailPhoto}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  logo_image: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  row_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailHeader: {
    width: '100%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  textHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  partOfDetail: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    marginBottom: 5,
    marginTop: 5,
  },
  titleOfPart: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 7,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  defFont: {
    fontSize: 18,
  },
  section: {
    margin: 10,
    padding: 10,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#fff',
  },
  detailPhoto: {
    width: 280,
    height: 300,
  },
});
