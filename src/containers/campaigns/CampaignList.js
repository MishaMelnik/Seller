import React, {Component} from 'react';
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  API,
  fetchList,
  ForbiddenError,
  UnauthorizedError,
} from '../../services';
import {USER_TYPES, getUserType, logout} from '../../services/auth';
// import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import {t} from '../../services/i18n';

const CampaignListItem = props => {
  const {onPress, life_status, logo, name} = props;

  return (
    <TouchableOpacity onPress={onPress} underlayColor="rgba(255,0,0,.1)">
      <View
        style={
          life_status === 'past'
            ? styles.campaignListItemPast
            : styles.campaignListItem
        }>
        <Image
          style={styles.campaignLogo}
          source={
            logo
              ? {uri: logo}
              : Platform.OS === 'ios'
              ? require('../../images/logo.png')
              : {uri: 'asset:/images/logo_android.png'}
          }
          defaultSource={
            Platform.OS === 'ios'
              ? require('../../images/logo.png')
              : {uri: 'asset:/images/logo_android.png'}
          }
        />
        <Text style={styles.campaignName}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default class CampaignList extends Component {
  state = {
    isLoading: true,
    campaignList: [],
  };

  componentDidMount() {
    // FCM.requestPermissions(); // for iOS
    // FCM.getFCMToken().then(token => {
    // store fcm token in your server
    // });

    // this.notificationListener = FCM.on(FCMEvent.Notification, async notif => {
    //   // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    //   if (notif.local_notification) {
    //     //this is a local notification
    //   }
    //   if (notif.opened_from_tray) {
    //     //app is open/resumed because user clicked banner
    //   }
    //   //await someAsyncCall();
    //
    //   if (Platform.OS === 'ios') {
    //     //optional
    //     //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
    //     //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
    //     //notif._notificationType is available for iOS platfrom
    //     switch (notif._notificationType) {
    //       case NotificationType.Remote:
    //         notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
    //         break;
    //       case NotificationType.NotificationResponse:
    //         notif.finish();
    //         break;
    //       case NotificationType.WillPresent:
    //         notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
    //         break;
    //     }
    //   }
    // });
    //
    // this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
    //   // fcm token may not be available on first load, catch it here
    // });

    this.loadData();
  }

  componentWillUnmount() {
    // stop listening for events
    this.notificationListener?.remove();
    this.refreshTokenListener?.remove();
  }

  _keyExtractor = (item, index) => item.id.toString();

  loadData = () => {
    getUserType()
      .then(userType => {
        return USER_TYPES.supervisor === userType
          ? API.supervisor.campaigns
          : API.seller.campaigns;
        //   return {
        //     [USER_TYPES.supervisor]: API.supervisor.campaigns,
        //     [USER_TYPES.seller]: API.seller.campaigns,
        //   })[userType];
      })
      .then(apiUrl => {
        if (!apiUrl) {
          throw new ForbiddenError();
        }
        return fetchList(apiUrl);
      })
      .then(response => {
        console.log('response', response);
        this.setState({
          campaignList: response,
          isLoading: false,
        });
      })
      .catch(error => {
        if (error instanceof UnauthorizedError) {
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        } else {
          console.error(error);
        }
      });
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <FlatList
        data={this.state.campaignList}
        initialNumToRender={10}
        keyExtractor={this._keyExtractor}
        refreshing={this.state.isLoading}
        onRefresh={this.loadData}
        renderItem={({item}) => (
          <CampaignListItem
            id={item.id}
            name={item.title}
            logo={item.logo}
            life_status={item.life_status}
            onPress={() => navigate('CampaignDetails', {id: item.id})}
          />
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  campaignListItem: {
    padding: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  campaignListItemPast: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  campaignLogo: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  campaignName: {
    fontSize: 16,
    flex: 1,
  },
});
