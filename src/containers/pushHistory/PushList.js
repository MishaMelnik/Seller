import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import {
  API,
  isLoggedIn,
  getUser,
  fetchList,
  notificationNumbers,
} from '../../services';

import Autolink from 'react-native-autolink';
import {getUserType} from '../../services/auth';
import Loader from '../../components/Loader';
import {t} from '../../services/i18n';

const PushItem = props => {
  const {data, onPress} = props;

  let backgroundColor = '#fff',
    color = '#fff';
  if (!data.is_read) {
    backgroundColor = '#cecccc';
    color = '#e31e24';
  }
  if (data.promo) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: backgroundColor,
          marginBottom: 15,
          padding: 5,
          borderRadius: 5,
        }}
        onPress={onPress}>
        <View>
          <View style={[styles.comment, {borderColor: '#dd7578'}]}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
              }}>
              {/*<Text style={styles.textReview}>{data.title}</Text>*/}
              <Text style={[styles.textReview, {width: '96%'}]}>
                {data.title}
              </Text>
              <Icon
                name="bell"
                size={20}
                color={color}
                style={{position: 'absolute', right: 0}}
              />
            </View>
            <Text style={styles.textReview}>{data.body}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <View
        style={{
          backgroundColor: backgroundColor,
          marginBottom: 15,
          padding: 5,
          borderRadius: 5,
        }}>
        <View>
          <View style={styles.comment}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.textReview}>{data.title}</Text>
              <Icon name="bell" size={20} color={color} />
            </View>
            {/* <Text style={styles.textReview}>{data.body}</Text> */}
            <Text style={styles.textReview}>
              <Autolink text={data.body} />
            </Text>
          </View>
        </View>
      </View>
    );
  }
};

export default class PushList extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      history: [],
    };
  }

  componentDidMount() {
    this.loadData();
    const loadDataTimeout = setTimeout(this.loadData, 5 * 1000);
    this.setState({
      loadDataTimeout: loadDataTimeout,
    });
  }

  loadData = () => {
    fetchList(API.pushHistory).then(response => {
      getUserType().then(userType => {
        this.setState({
          history: response,
          user: userType,
          isLoading: false,
        });
      });
    });
  };

  componentWillUnmount() {
    clearInterval(this.state.loadDataTimeout);
  }

  render() {
    const {navigate} = this.props.navigation;
    const {isLoading, history} = this.state;

    if (!isLoading) {
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>{t('Push-notifications history')}</Text>
          <FlatList
            data={history}
            refreshing={isLoading}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={this.loadData}
            renderItem={({item}) => (
              <PushItem
                data={item}
                onPress={() => {
                  navigate('CampaignDetails', {id: item.promo});
                }}
              />
            )}
          />
          {this.state.user === 1 ? (
            <View style={{padding: 10}}>
              <TouchableOpacity
                onPress={() => navigate('PushNotification')}
                style={styles.simpleButtons}>
                <Text style={styles.simpleButtonText}>
                  {t('To write a message').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
        </View>
      );
    }
    return <Loader />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
  },
  heading: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 30,
  },
  simpleButtons: {
    height: 40,
    backgroundColor: '#e31e24',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  simpleButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  comment: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: '95%',
    borderRadius: 5,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  feedback: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: '95%',
    marginLeft: 15,
    borderRadius: 5,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  cityReview: {
    color: '#000',
  },
  textReview: {
    fontSize: 15,
    color: '#000000',
  },
});
