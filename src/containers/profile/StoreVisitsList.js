import React, {Component} from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import moment from 'moment/moment';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

import Loader from '../../components/Loader';

import {fetchList, API} from '../../services';

import Logo from '../../images/logo.png';

import theme from '../../styles';

class StoreVisitListItem extends Component {
  getUserName(item) {
    if (item.first_name.length && item.last_name.length) {
      return `${item.first_name} ${item.last_name}`;
    } else {
      return item.phone;
    }
  }

  _onPress = () => {
    const {visit, navigation} = this.props;

    navigation.navigate('StoreVisitDetail', {visitId: visit.id});
  };

  render() {
    const {visitor, store, date, closing_date} = this.props.visit;

    return (
      <TouchableOpacity style={styles.visitItem} onPress={this._onPress}>
        {/*<View style={styles.visitItemTop}>*/}
        {/*<Text style={styles.visitorName}>{this.getUserName(visitor)}</Text>*/}
        {/*<Text style={styles.storeTitle}>{store.title}</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.visitItemBottom}>*/}
        {/*<Text style={styles.visitDate}>{Moment(date).format('HH:mm')}</Text>*/}
        {/*<Text style={styles.visitAddress}>{address}</Text>*/}
        {/*</View>*/}
        <View style={styles.visit_column}>
          <Text style={styles.visitorName}>{this.getUserName(visitor)}</Text>
          <View style={styles.row_container}>
            <Image
              source={
                Platform.OS === 'ios'
                  ? Logo
                  : {uri: 'asset:/images/logo_android.png'}
              }
              style={styles.visitItem_image}
            />
            <Text style={styles.storeTitle}>{store.title}</Text>
          </View>
        </View>
        <View style={[styles.visit_column, styles.positionCenter]}>
          {closing_date ? (
            <Icon
              color={'#ff0000'}
              style={{width: 25}}
              name="stop-circle"
              size={23}
            />
          ) : (
            <Icon
              color={'#008000'}
              style={{width: 25}}
              name="play-circle"
              size={23}
            />
          )}
        </View>
        <View style={[styles.visit_column, styles.positionCenter]}>
          <Icon
            color={'#000'}
            style={{width: 25}}
            name="arrow-right"
            size={23}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default class StoreVisitsList extends Component {
  constructor() {
    super();

    this.state = {
      visits: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    fetchList(API.supervisor.stores.visits.list).then(visits => {
      visits = visits.sort((v1, v2) => v2.id - v1.id);
      const visitGroups = {};
      for (let visit of visits) {
        const group = moment(`${visit.date}`).format('YYYYMMDD');
        visitGroups[group] = visitGroups[group] || {
          key: group,
          title: moment(`${visit.date}`).format('DD.MM.YYYY'),
          data: [],
        };
        visitGroups[group].data.push(visit);
      }
      this.setState({
        visits: Object.keys(visitGroups)
          .map(key => visitGroups[key])
          .sort((g1, g2) => g2.key - g1.key),
        isLoading: false,
      });
    });
  }

  render() {
    const {navigation} = this.props;
    if (this.state.isLoading) {
      return <Loader />;
    }

    return (
      <View style={theme.container}>
        <SectionList
          sections={this.state.visits}
          renderSectionHeader={({section}) => (
            <Text style={styles.daySection}>{section.title}</Text>
          )}
          renderItem={({item}) => (
            <StoreVisitListItem visit={item} navigation={navigation} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  daySection: {
    fontSize: 22,
    padding: 10,
    textAlign: 'center',
  },
  visitItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  visitItemTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
  },
  visitItemBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
  },
  visitorName: {
    fontSize: 16,
    marginBottom: 5,
  },
  storeTitle: {
    fontSize: 16,
  },
  visitDate: {
    fontSize: 12,
  },
  visitAddress: {
    fontSize: 11,
  },
  visit_column: {
    flexDirection: 'column',
  },
  positionCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitItem_image: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  row_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
