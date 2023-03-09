import React, {Component} from 'react';
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  API,
  fetchList,
  ForbiddenError,
  UnauthorizedError,
} from '../../services';
import {USER_TYPES, getUserType, logout} from '../../services/auth';
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
              : {uri: 'asset:/images/logo.png'}
          }
          defaultSource={{uri: 'asset:/images/logo_android.png'}}
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
    this.loadData();
  }

  _keyExtractor = (item, index) => item.id.toString();

  loadData = () => {
    getUserType()
      .then(userType => {
        return {
          [USER_TYPES.supervisor]: API.supervisor.allcampaigns,
        }[userType];
      })
      .then(apiUrl => {
        if (!apiUrl) {
          throw new ForbiddenError();
        }
        return fetchList(apiUrl);
      })
      .then(response => {
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
