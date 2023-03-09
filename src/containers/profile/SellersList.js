import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Loader from '../../components/Loader';

import {fetchList, API, deleteObject} from '../../services';
// import {getUser} from '@app/services/auth';
import {t} from '../../services/i18n';
import theme, {TEXT_COLOR} from '../../styles';

const SellerListItem = props => {
  const {name, location, id, removeHandler} = props;

  return (
    <View style={styles.sellerItem}>
      <Text style={styles.sellerItemText}>{name}</Text>

      <Text style={styles.sellerItemLocation}>{location}</Text>

      <TouchableOpacity
        style={styles.sellerItemEdit}
        onPress={() => {
          props.navigate('SellerDetails', {id: id});
        }}>
        <Icon name="edit" size={22} color={TEXT_COLOR} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.sellerItemDelete} onPress={removeHandler}>
        <Icon name="trash" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export default class SellersList extends Component {
  constructor() {
    super();

    this.state = {
      sellersList: [],
      isLoading: true,
    };

    this.locations = [];
  }

  componentDidMount() {
    // TODO: in sellers list get city name from API
    fetchList(API.supervisor.locations)
      .then(locations => {
        this.locations = locations;
        return fetchList(API.supervisor.sellers);
      })
      .then(sellers => {
        sellers.forEach(seller => {
          if (seller.city) {
            let city_name = this.locations.filter(
              location => location.id === seller.city,
            );
            seller.city = city_name.length ? city_name[0].name || null : null;
          }
        });
        this.setState({
          sellersList: sellers,
          isLoading: false,
        });
      });
  }

  _keyExtractor = (item, index) => item.id.toString();

  removeSeller(id) {
    let updatedSellersList = this.state.sellersList.filter(
      item => item.id !== id,
    );

    deleteObject(API.supervisor.sellers, id).then(() => {
      this.setState({sellersList: updatedSellersList});
    });
  }

  confirmRemoveSeller(id) {
    let user = this.state.sellersList.filter(item => item.id === id)[0];

    Alert.alert(
      t('Delete seller'),
      `${t('Are you sure you want to delete')} ${
        user.first_name || user.phone
      }?`,
      [
        {
          text: t('Delete'),
          onPress: () => {
            this.removeSeller(id);
          },
        },
        {
          text: t('Cancel'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }

  getUserName(item) {
    if (item.first_name.length && item.last_name.length) {
      return `${item.first_name} ${item.last_name}`;
    } else {
      return item.phone;
    }
  }

  render() {
    const {navigate} = this.props.navigation;

    if (this.state.isLoading) {
      return <Loader />;
    } else {
      return (
        <View style={theme.container}>
          <FlatList
            data={this.state.sellersList}
            initialNumToRender={10}
            keyExtractor={this._keyExtractor}
            renderItem={({item}) => (
              <SellerListItem
                id={item.id}
                name={this.getUserName(item)}
                location={item.city}
                navigate={navigate}
                removeHandler={() => this.confirmRemoveSeller(item.id)}
              />
            )}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  sellerItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
  },
  sellerItemText: {
    fontSize: 16,
    flex: 5,
  },
  sellerItemLocation: {
    fontSize: 14,
    flex: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
  sellerItemEdit: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerItemDelete: {
    marginLeft: 10,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
