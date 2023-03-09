import 'react-native-gesture-handler';

import React, {useState, useEffect} from 'react';
import {TouchableHighlight, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  useNavigation,
  NavigationContainer,
  DrawerActions,
} from '@react-navigation/native';

// import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
// import Moment from 'moment';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {createDrawerNavigator} from '@react-navigation/drawer';

import {createStackNavigator} from '@react-navigation/stack';

import CampaignCreateForm from './containers/campaigns/CampaignCreate';
import CampaignDetails from './containers/campaigns/CampaignDetails';
import CampaignList from './containers/campaigns/CampaignList';
import AllCampaignList from './containers/campaigns/AllCampaignList';
import CampaignEdit from './containers/campaigns/CampaignEdit';
import Login from './containers/Login';
import SetStore from './containers/SetStore';
import CloseDaySetStore from './containers/CloseDaySetStore';
import Drawer from './components/Drawer';
import SaleList from './containers/sales/SaleList';

//Renamed path
import SaleByShare from './containers/sales/SaleByShare_';
import Profile from './containers/profile/Profile';
import ChangePassword from './containers/profile/ChangePassword';
import SellersList from './containers/profile/SellersList';
import SellerDetails from './containers/profile/SellerDetails';
import StoreVisitsList from './containers/profile/StoreVisitsList';
import {StoreVisitDetail} from './containers/profile/StoreVisitDetail';
import CreateSeller from './containers/profile/CreateSeller';
import QRcode from './containers/QRcode';
import PushNotification from './containers/pushHistory/PushNotification';
import PushHistory from './containers/pushHistory/PushList';
import RevAndSugList from './containers/ReviewsAndSuggestions/RevAndSugList';
import ReviewDetail from './containers/ReviewsAndSuggestions/ReviewDetail';
import Identification from './containers/sales/IdentificationCustomer';
import RememberPassword from './containers/RememberPassword';
import RestorePassword from './containers/RestorePassword';
import LoyaltyTerms from './containers/LoyaltyTerms';
import {getUserType, logout} from './services/auth';
import {PRIMARY_COLOR} from './styles/index';
import {BeCraftList} from './containers/BeCraft/BeCraftList';
import {BeCraftRecipeStage1} from './containers/BeCraft/BeCraftRecipeStage1';
import {BeCraftRecipeStage2} from './containers/BeCraft/BeCraftRecipeStage2';
import {Catalog} from './containers/Catalog';
import {CatalogItemDetail} from './containers/Catalog/CatalogItemDetail';
import {Salary} from './containers/Salary';
import {SocialMedia} from './containers/social/SocialMedia';
import {logger} from 'react-native-logs';

import * as Sentry from '@sentry/react-native';
// import messaging from '@react-native-firebase/messaging';

Sentry.init({
  dsn: 'https://46625e562e3b4bd2aff63c32a5416791@sentry.io/1780076',
});

const DrawerNavigation = () => {
  const DrawerInstance = createDrawerNavigator();
  return (
    <DrawerInstance.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
      drawerContent={props => <Drawer drawerProps={props} />}>
      <DrawerInstance.Screen name="Home" component={CampaignList} />
      <DrawerInstance.Screen
        name="AllCampaignList"
        component={AllCampaignList}
      />
      <DrawerInstance.Screen name="PurchasesList" component={SaleList} />
      <DrawerInstance.Screen name="Profile" component={Profile} />
      <DrawerInstance.Screen name="ChangePassword" component={ChangePassword} />
      <DrawerInstance.Screen
        name="CampaignCreate"
        component={CampaignCreateForm}
      />
      <DrawerInstance.Screen name="PushHistory" component={PushHistory} />
      <DrawerInstance.Screen name="SellersList" component={SellersList} />
      <DrawerInstance.Screen name="CreateSeller" component={CreateSeller} />
      <DrawerInstance.Screen
        name="StoreVisitsList"
        component={StoreVisitsList}
      />
      <DrawerInstance.Screen name="RevAndSugList" component={RevAndSugList} />
      <DrawerInstance.Screen name="LoyaltyTerms" component={LoyaltyTerms} />
      <DrawerInstance.Screen
        name="CloseDaySetStore"
        component={CloseDaySetStore}
      />
      <DrawerInstance.Screen name="BeCraft" component={BeCraftList} />
      <DrawerInstance.Screen name="Catalog" component={Catalog} />
      <DrawerInstance.Screen name="Salary" component={Salary} />
      <DrawerInstance.Screen name="SocialMedia" component={SocialMedia} />
    </DrawerInstance.Navigator>
  );
};

const RoutingComponent = ({userType}) => {
  const Stack = createStackNavigator();
  const navigation = useNavigation();

  const getNavOptions = () => {
    return {
      headerMode: 'screen',
      title: 'Perfums Bar',
      headerTintColor: 'white',
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: PRIMARY_COLOR,
      },
      headerTitleStyle: {
        color: 'white',
      },
      statusBarStyle: 'light-content',
      headerLeft: () => (
        <TouchableHighlight
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            Keyboard.dismiss();
          }}
          style={{
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            marginLeft: 5,
          }}
          underlayColor="#e31e24">
          <Icon name="bars" size={22} color="white" />
        </TouchableHighlight>
      ),
      headerRight: () => (
        <TouchableHighlight
          onPress={() => {
            getUserType().then(userType => {
              if (userType === 2) {
                navigation.navigate('CloseDaySetStore', {type: 'logout'});
              } else {
                logout();
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
              }
            });
          }}
          style={{
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            marginRight: 5,
          }}>
          <Icon name="sign-out" size={22} color="white" />
        </TouchableHighlight>
      ),
    };
  };

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
      }}>
      {/*<Stack.Screen*/}
      {/*  options={{*/}
      {/*    headerShown: true,*/}
      {/*  }}*/}
      {/*  name="SetStore"*/}
      {/*  component={SetStore}*/}
      {/*/>*/}
      {/*<Stack.Screen name="CloseDaySetStore" component={CloseDaySetStore} />*/}
      <Stack.Screen
        name="Homes"
        component={DrawerNavigation}
        options={getNavOptions}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetails} />
      <Stack.Screen name="SellerDetails" component={SellerDetails} />
      <Stack.Screen name="StoreVisitDetail" component={StoreVisitDetail} />
      <Stack.Screen name="CampaignEdit" component={CampaignEdit} />
      <Stack.Screen name="QRcode" component={QRcode} />
      <Stack.Screen name="Identification" component={Identification} />
      <Stack.Screen name="ReviewDetail" component={ReviewDetail} />
      <Stack.Screen name="SaleByShare" component={SaleByShare} />
      <Stack.Screen name="PushNotification" component={PushNotification} />
      <Stack.Screen name="RememberPassword" component={RememberPassword} />
      <Stack.Screen name="RestorePassword" component={RestorePassword} />
      <Stack.Screen
        name="BeCraftRecipeStage1"
        component={BeCraftRecipeStage1}
      />
      <Stack.Screen
        name="BeCraftRecipeStage2"
        component={BeCraftRecipeStage2}
      />
      <Stack.Screen name="CatalogItemDetail" component={CatalogItemDetail} />
      <Stack.Screen name="SocialMedia" component={SocialMedia} />
    </Stack.Navigator>
  );
  // return <NavApp ref="navigator" screenProps={{userType}} />;
};
const App = () => {
  const log = logger.createLogger();

  const [userType, setUserType] = useState(null);
  // const [store, setStore] = useState(null);

  useEffect(() => {
    getUserType().then(userType => {
      log.info('userType', userType);
      setUserType(userType);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    log.info('user', userType);
    if (userType) {
    }
    // eslint-disable-next-line
  }, [userType]);

  return (
    <NavigationContainer>
      <RoutingComponent userType={userType} />
    </NavigationContainer>
  );
};

// class App extends Component {
//
//   constructor() {
//     super();
//
//     this.state = {
//       userType: null,
//       store: null,
//     };
//
//     this.drawerIsOpened = false;
//   }
//
//   componentDidMount() {
//     getUserType()
//       .then(userType => {
//         this.setState({
//           userType: userType,
//         });
//       })
//       .then(() => {
//         if (this.state.userType) {
//           const navigator = this.refs.navigator;
//
//           FCM.getInitialNotification().then(notification => {
//             if (notification && notification.hasOwnProperty('type')) {
//               if (notification.type === 'promo') {
//                 let id = parseInt(notification.obj_id, 10);
//                 navigator._navigation.navigate('CampaignDetails', {id: id});
//               } else {
//                 if (notification.type === 'comment') {
//                   navigator._navigation.navigate('RevAndSugList');
//                 } else {
//                   navigator._navigation.navigate('PushHistory');
//                 }
//               }
//             }
//           });
//
//           this.notificationListener = FCM.on(
//             FCMEvent.Notification,
//             async notif => {
//               if (notif.opened_from_tray) {
//                 if (notif.type === 'promo') {
//                   let id = parseInt(notif.obj_id, 10);
//                   navigator._navigation.navigate('CampaignDetails', {id: id});
//                 } else {
//                   if (notif.type === 'comment') {
//                     navigator._navigation.navigate('RevAndSugList');
//                   } else {
//                     navigator._navigation.navigate('PushHistory');
//                   }
//                 }
//               }
//               //await someAsyncCall();
//
//               if (Platform.OS === 'ios') {
//                 switch (notif._notificationType) {
//                   case NotificationType.Remote:
//                     notif.finish(RemoteNotificationResult.NewData);
//                     break;
//                   case NotificationType.NotificationResponse:
//                     notif.finish();
//                     break;
//                   case NotificationType.WillPresent:
//                     notif.finish(WillPresentNotificationResult.All);
//                     break;
//                 }
//               }
//             },
//           );
//         }
//       });
//   }
//
//   componentWillUnmount() {
//     this.notificationListener.remove();
//   }
//
//   getNavOptions({navigation}) {
//     return {
//       headerMode: 'screen',
//       title: 'Perfums Bar',
//       headerTintColor: 'white',
//       headerBackTitle: null,
//       headerStyle: {
//         backgroundColor: PRIMARY_COLOR,
//       },
//       headerTitleStyle: {
//         color: 'white',
//       },
//       statusBarStyle: 'light-content',
//       headerLeft: (
//         <TouchableHighlight
//           onPress={() => {
//             const {routes, index} = navigation.state;
//             if (routes[index].routeName !== 'DrawerOpen') {
//               navigation.navigate('DrawerOpen');
//               Keyboard.dismiss();
//             } else {
//               navigation.navigate('DrawerClose');
//             }
//           }}
//           style={{
//             paddingTop: 5,
//             paddingBottom: 5,
//             paddingLeft: 10,
//             paddingRight: 10,
//             marginLeft: 5,
//           }}
//           underlayColor="#e31e24">
//           <Icon name="bars" size={22} color="white" />
//         </TouchableHighlight>
//       ),
//       headerRight: (
//         <TouchableHighlight
//           onPress={() => {
//             getUserType().then(userType => {
//               if (userType === 2) {
//                 navigation.navigate('CloseDaySetStore', {type: 'logout'});
//               } else {
//                 logout();
//                 navigation.dispatch({
//                   type: 'Navigation/RESET',
//                   index: 0,
//                   actions: [{type: 'Navigate', routeName: 'Login'}],
//                 });
//               }
//             });
//           }}
//           style={{
//             paddingTop: 5,
//             paddingBottom: 5,
//             paddingLeft: 10,
//             paddingRight: 10,
//             marginRight: 5,
//           }}>
//           <Icon name="sign-out" size={22} color="white" />
//         </TouchableHighlight>
//       ),
//     };
//   }
//
//   render() {
//     AppScreenNavigator.navigationOptions = this.getNavOptions;
//
//     const NavApp = StackNavigator(
//       {
//         SetStore: {screen: SetStore},
//         CloseDaySetStore: {screen: CloseDaySetStore},
//         Home: {screen: AppScreenNavigator},
//         Login: {screen: Login},
//         CampaignDetails: {screen: CampaignDetails},
//         SellerDetails: {screen: SellerDetails},
//         StoreVisitDetail: {screen: StoreVisitDetail},
//         CampaignEdit: {screen: CampaignEdit},
//         QRcode: {screen: QRcode},
//         Identification: {screen: Identification},
//         ReviewDetail: {screen: ReviewDetail},
//         SaleByShare: {screen: SaleByShare},
//         PushNotification: {screen: PushNotification},
//         RememberPassword: {screen: RememberPassword},
//         RestorePassword: {screen: RestorePassword},
//         BeCraftRecipeStage1: {screen: BeCraftRecipeStage1},
//         BeCraftRecipeStage2: {screen: BeCraftRecipeStage2},
//         CatalogItemDetail: {screen: CatalogItemDetail},
//         SocialMedia: {screen: SocialMedia}, //add
//       },
//       {
//         initialRouteName: this.state.userType ? 'Home' : 'Login',
//         navigationOptions: {
//           headerMode: 'screen',
//           headerTintColor: 'white',
//           headerStyle: {
//             backgroundColor: PRIMARY_COLOR,
//           },
//         },
//       },
//     );
//
//     return (
//       <NavigationContainer>
//         <NavApp ref="navigator" screenProps={{userType: this.state.userType}} />
//       </NavigationContainer>
//     );
//   }
// }

export default App;
