import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Loader from '../../components/Loader';
import Autolink from 'react-native-autolink';
import {API, fetchDetails} from '../../services';
import {USER_TYPES, getUserType} from '../../services/auth';
import {t} from '../../services/i18n';
import theme from '../../styles';
import {PRIMARY_COLOR} from '../../styles';

export default class CampaignDetails extends Component {
  state = {
    isLoading: true,
  };

  componentDidMount() {
    const campaignState = this.props.navigation.state;

    getUserType()
      .then(userType => {
        this.setState({user: userType});
        return {
          [USER_TYPES.supervisor]: API.supervisor.allcampaigns,
          [USER_TYPES.seller]: API.seller.campaigns,
        }[userType];
      })
      .then(apiUrl => fetchDetails(apiUrl, campaignState.params.id))
      .then(detailsJSON => {
        detailsJSON.isLoading = false;
        this.setState(detailsJSON);
      });
  }

  redirectToQRAuth = () => {
    const {id} = this.props.navigation.state.params;
    const {navigate} = this.props.navigation;

    navigate('QRcode', {purchaseId: id});
  };

  redirectToEdit = () => {
    const {id} = this.state;
    const {navigate} = this.props.navigation;

    navigate('CampaignEdit', {id: id});
  };

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    }

    const {navigate} = this.props.navigation;
    const {
      user,
      logo,
      title,
      date_start,
      date_end,
      description,
      life_status,
      owner,
    } = this.state;

    if (user === 2) {
      return (
        <View style={styles.detailsContainer}>
          <ScrollView>
            <View style={styles.logoCanvas}>
              <Image
                ref="campaignLogo"
                style={styles.campaignLogo}
                source={
                  logo
                    ? {uri: logo.uri}
                    : Platform.OS === 'ios'
                    ? require('../../images/logo_words.png')
                    : {uri: 'asset:/images/logo_words.png'}
                }
                resizeMode={logo ? 'cover' : 'contain'}
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.campaignTitle}>{title}</Text>
              <View style={styles.campaignDates}>
                <Icon
                  name="calendar"
                  size={18}
                  style={styles.campaignDatesIcon}
                />
                <Text style={styles.campaignDatesText}>
                  {date_start} - {date_end}
                </Text>
              </View>
              <Text>
                <Autolink text={description} />
              </Text>
            </View>
            {/*<Text style={life_status === 'past' || life_status === 'future' ? {display: 'none'}: styles.chooseToContinue}>*/}
            {/*{t('Will take advantage')}:*/}
            {/*</Text>*/}
            <View
              style={
                life_status === 'past' || life_status === 'future'
                  ? {display: 'none'}
                  : styles.paddingButtons
              }>
              <TouchableOpacity
                onPress={this.redirectToQRAuth}
                style={theme.simpleButtons}>
                <Text style={theme.simpleButtonText}>
                  {'Сканувати QR код'.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.detailsContainer}>
          <ScrollView>
            <View style={styles.logoCanvas}>
              <Image
                ref="campaignLogo"
                style={styles.campaignLogo}
                source={
                  logo
                    ? {uri: logo.uri}
                    : Platform.OS === 'ios'
                    ? require('../../images/logo_words.png')
                    : {uri: 'asset:/images/logo_words.png'}
                }
                resizeMode={logo ? 'cover' : 'contain'}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.campaignTitle}>{title}</Text>
              <View style={styles.campaignDates}>
                <Icon
                  name="calendar"
                  size={18}
                  style={styles.campaignDatesIcon}
                />
                <Text style={styles.campaignDatesText}>
                  {date_start} - {date_end}
                </Text>
              </View>
              <Text>
                <Autolink text={description} />
              </Text>
            </View>
            <View style={owner ? {padding: 20} : {display: 'none'}}>
              <TouchableOpacity
                onPress={this.redirectToEdit}
                style={theme.simpleButtons}>
                <Text style={theme.simpleButtonText}>
                  {t('Edit').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoCanvas: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: PRIMARY_COLOR,
  },
  campaignLogo: {
    flex: 1,
    alignSelf: 'stretch',
    width: null,
    height: 150,
  },
  textContainer: {
    padding: 10,
  },
  paddingButtons: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  campaignTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  chooseToContinue: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  campaignDates: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  campaignDatesText: {
    fontSize: 14,
    color: '#888',
  },
  campaignDatesIcon: {
    marginRight: 5,
    color: '#888',
  },
});
