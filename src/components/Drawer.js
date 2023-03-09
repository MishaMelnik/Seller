import React, {Component} from 'react';
import {
  View,
  TouchableHighlight,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {FONT_COLOR} from '../styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {getUserType, getUser, isLoggedIn} from '../services/auth';
import {API, fetchList, notificationNumbers} from '../services';
import {t} from '../services/i18n';
import Communications from 'react-native-communications';
import {
  HOTLINE_NUMBER,
  HOTLINE_NUMBER_for_CALL,
  EMAIL_HOTLINE,
} from '../config';

import BECRAFTLOGO from '../images/be_craft_logo.png';

import moment from 'moment/moment';

const SupervisorPages = [
  {title: t('My Campaigns'), screen: 'Home', icon: 'list'},
  {title: t('All Campaigns'), screen: 'AllCampaignList', icon: 'list'},
  {
    title: t('Sales of sellers'),
    screen: 'PurchasesList',
    icon: 'shopping-cart',
  },
  {title: t('Profile'), screen: 'Profile', icon: 'user'},
  {title: t('Change password'), screen: 'ChangePassword', icon: 'key'},
  {title: t('New campaign'), screen: 'CampaignCreate', icon: 'plus-circle'},
  {title: t('Push-notifications history'), screen: 'PushHistory', icon: 'bell'},
  {title: t('Sellers list'), screen: 'SellersList', icon: 'list-ol'},
  {title: t('Create seller'), screen: 'CreateSeller', icon: 'user-plus'},
  {title: t('Store visits list'), screen: 'StoreVisitsList', icon: 'list-ol'},
  {title: t('Reviews and Suggestions'), screen: 'RevAndSugList', icon: 'edit'},
  {title: t('Loyalty Program Terms'), screen: 'LoyaltyTerms', icon: 'percent'},
  {title: t('SocialMedia'), screen: 'SocialMedia', icon: 'comments'},
];

const SellerPages = [
  {title: t('Campaigns'), screen: 'Home', icon: 'list'},
  {title: t('My sales'), screen: 'PurchasesList', icon: 'shopping-cart'},
  {title: t('My salary'), screen: 'Salary', icon: 'money'},
  {title: t('Perfume shop'), screen: 'BeCraft', icon: 'flask'},
  {title: t('Product Catalog'), screen: 'Catalog', icon: 'shopping-bag'},
  {title: t('Profile'), screen: 'Profile', icon: 'user'},
  {title: t('Change password'), screen: 'ChangePassword', icon: 'key'},
  {title: t('Push-notifications history'), screen: 'PushHistory', icon: 'bell'},
  {title: t('Loyalty Program Terms'), screen: 'LoyaltyTerms', icon: 'percent'},
  {
    title: t('Closing the working day'),
    screen: 'CloseDaySetStore',
    icon: 'sign-out',
    color: '#ff0000',
  },
  {title: t('SocialMedia'), screen: 'SocialMedia', icon: 'comments'},
];

class DrawerItems extends Component {
  render() {
    const pages = this.props.userType === 1 ? SupervisorPages : SellerPages;
    const {navigate} = this.props.navigation;
    const {pushes, comments, is_show_craft} = this.props;

    return (
      <View>
        {pages.map((item, index) => {
          if (item.screen === 'BeCraft') {
            if (!is_show_craft) {
              return null;
            } else {
              return (
                <TouchableHighlight
                  underlayColor="#eee"
                  key={index}
                  onPress={() => navigate(item.screen)}>
                  <View
                    style={{
                      paddingLeft: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={
                        Platform.OS === 'ios'
                          ? BECRAFTLOGO
                          : {uri: 'asset:/images/be_craft_logo.png'}
                      }
                      style={{width: 30, height: 36, marginRight: 2}}
                      resizeMode={'contain'}
                    />
                    {/*<Image source={BECRAFTLOGO} style={{ width: 36, height: 36, marginRight: 2 }} resizeMode={'contain'} />*/}
                    <View style={{borderRadius: 7, backgroundColor: '#977060'}}>
                      <Text
                        style={[
                          styles.drawerItemText,
                          {padding: 5, color: '#fff', fontWeight: 'bold'},
                        ]}>
                        {item.title}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              );
            }
          }
          if (item.screen === 'PushHistory') {
            return (
              <TouchableHighlight
                underlayColor="#eee"
                key={index}
                onPress={() => navigate(item.screen)}>
                <View style={styles.drawerItem}>
                  <Icon
                    color={FONT_COLOR}
                    style={styles.styleForIconsInDrawer}
                    name={item.icon}
                    size={16}
                  />
                  <View style={styles.rowDrawer}>
                    <Text style={styles.drawerItemText}>{item.title}</Text>
                    <View
                      style={
                        pushes > 0 ? styles.rowDrawerNumber : {display: 'none'}
                      }>
                      <Text style={{fontSize: 13, color: '#e31e24'}}>
                        {pushes}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            );
          } else {
            if (item.screen === 'RevAndSugList') {
              return (
                <TouchableHighlight
                  underlayColor="#eee"
                  key={index}
                  onPress={() => navigate(item.screen)}>
                  <View style={styles.drawerItem}>
                    <Icon
                      color={FONT_COLOR}
                      style={styles.styleForIconsInDrawer}
                      name={item.icon}
                      size={16}
                    />
                    <View style={styles.rowDrawer}>
                      <Text style={styles.drawerItemText}>{item.title}</Text>
                      <View
                        style={
                          comments > 0
                            ? styles.rowDrawerNumber
                            : {display: 'none'}
                        }>
                        <Text style={{fontSize: 13, color: '#e31e24'}}>
                          {comments}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
              );
            } else {
              if (item.screen === 'CloseDaySetStore') {
                return (
                  <TouchableHighlight
                    underlayColor="#eee"
                    key={index}
                    onPress={() => navigate(item.screen, {type: 'none'})}>
                    <View style={styles.drawerItem}>
                      <Icon
                        color={item.color ? item.color : FONT_COLOR}
                        style={styles.styleForIconsInDrawer}
                        name={item.icon}
                        size={16}
                      />
                      <Text style={styles.drawerItemText}>{item.title}</Text>
                    </View>
                  </TouchableHighlight>
                );
              } else {
                return (
                  <TouchableHighlight
                    underlayColor="#eee"
                    key={index}
                    onPress={() => navigate(item.screen)}>
                    <View style={styles.drawerItem}>
                      <Icon
                        color={item.color ? item.color : FONT_COLOR}
                        style={styles.styleForIconsInDrawer}
                        name={item.icon}
                        size={16}
                      />
                      <Text style={styles.drawerItemText}>{item.title}</Text>
                    </View>
                  </TouchableHighlight>
                );
              }
            }
          }
        })}
      </View>
    );
  }
}

export default class Drawer extends Component {
  state = {
    user_type: null,
    first_name: null,
    last_name: null,
    is_show_craft: false,
  };

  getNumbers = () => {
    fetchList(API.digits).then(response => {
      this.setState({
        push: response.push,
        comment: response.comment,
      });
    });
  };

  componentDidMount() {
    // if (AppState.currentState === 'active') {
    isLoggedIn().then(isLoggedIn => {
      if (isLoggedIn === true) {
        const getNumbersInterval = setInterval(this.getNumbers, 10 * 1000);
        this.setState({getNumbersInterval: getNumbersInterval});
      }
    });
    // }

    getUser().then(user => {
      this.setState({
        user_type: user.user_type,
        first_name: user.first_name,
        last_name: user.last_name,
      });

      if (user.user_type === 2) {
        const today = moment().format('YYYYMMDD');
        AsyncStorage.getItem('lastStoreUpdate').then(lastStoreUpdate => {
          if (lastStoreUpdate !== today) {
            if (Platform.OS === 'ios') {
              this.props.drawerProps.navigation.reset({
                index: 0,
                routes: [{name: 'SetStore'}],
              });
            } else {
              this.props.drawerProps.navigation.push('SetStore');
            }
          } else {
            AsyncStorage.getItem('current_store').then(current_store => {
              this.setState({
                is_show_craft: JSON.parse(current_store).is_show_craft || false,
              });
            });
          }
        });
      }
    });
  }

  componentDidUpdate(nextProps, nextState) {
    getUser().then(user => {
      if (
        user.first_name !== nextState.first_name ||
        user.last_name !== nextState.last_name
      ) {
        this.setState(user);
      }
    });
  }

  handleCommunicateEmail = () => {
    Communications.email([EMAIL_HOTLINE, ''], null, null, '', '');
  };

  handleCommunicatePhone = () => {
    Communications.phonecall(HOTLINE_NUMBER_for_CALL, true);
  };

  componentWillUnmount() {
    clearInterval(this.state.getNumbersInterval);
  }

  render() {
    let props = this.props.drawerProps;
    const {
      first_name,
      last_name,
      user_type,
      push,
      comment,
      phone,
      is_show_craft,
    } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container} ref="drawer">
        <View style={styles.drawerHeader}>
          <Text style={styles.nameSurname}>
            {first_name === '' ? phone : first_name}
          </Text>
          <Text style={styles.nameSurname}>{last_name}</Text>
        </View>

        <View style={styles.drawerItemsContainer}>
          <ScrollView>
            <DrawerItems
              {...props}
              userType={user_type}
              pushes={push}
              comments={comment}
              is_show_craft={is_show_craft}
            />
          </ScrollView>
          {/* <View>
            <Text style={styles.callAdmin}>{t('Administration:')}</Text>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity onPress={this.handleCommunicateEmail}>
                <View style={styles.holder}>
                  <Text style={[styles.callAdmin, { fontSize: 13 }]}>{EMAIL_HOTLINE}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleCommunicatePhone}>
                <View style={styles.holder}>
                  <Text style={[styles.callAdmin, { fontSize: 13 }]}>{HOTLINE_NUMBER}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View> */}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#efefef',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: 7,
    paddingBottom: 7,
  },
  drawerItemsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  nameSurname: {
    margin: 6,
    fontSize: 16,
    textAlign: 'center',
  },
  callAdmin: {
    marginBottom: 20,
    textAlign: 'center',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 15,
    paddingTop: 7,
    paddingBottom: 7,
  },
  drawerItemText: {
    fontSize: 15,
    color: FONT_COLOR,
  },
  rowDrawer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowDrawerNumber: {
    marginLeft: 4,
    backgroundColor: '#ededed',
    borderRadius: 10,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    borderWidth: 1,
    borderColor: '#e31e24',
  },
  styleForIconsInDrawer: {
    width: 23,
    textAlign: 'center',
    marginRight: 4,
  },
});
