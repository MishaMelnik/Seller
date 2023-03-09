import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

import {API, fetchList} from '../../services';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {t} from '../../services/i18n';
import Loader from '../../components/Loader';

const Review = props => {
  const {data, onPress} = props;

  let backgroundColor = '#fff',
    color = '#fff';
  if (data.unread) {
    backgroundColor = '#cecccc';
    color = '#e31e24';
  }
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
        <View style={styles.comment}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text>
              {t('City')}: {data.city}
            </Text>
            <Icon name="bell" size={20} color={color} />
          </View>
          <Text style={styles.textReview}>
            {t('Author')}: {data.author}
          </Text>
          <Text style={styles.textReview}>
            {t('Theme')}: {data.theme}
          </Text>
          <Text style={styles.textReview}>{data.description}</Text>
        </View>
        {data.feedback !== null ? (
          <View style={styles.feedback}>
            <Text>
              {' '}
              {t('Author')}: {data.feedback.author}
            </Text>
            <Text style={styles.textReview}>
              {' '}
              {data.feedback.description || ''}
            </Text>
          </View>
        ) : (
          <View />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default class RevAndSugList extends Component {
  state = {
    reviewsList: [],
    isLoading: true,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    fetchList(API.comments).then(response => {
      this.setState({
        reviewsList: response,
        isLoading: false,
      });
    });
  };

  render() {
    const {navigate} = this.props.navigation;

    const {isLoading, reviewsList} = this.state;

    if (!isLoading) {
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>{t('Reviews and Suggestions')}</Text>
          <FlatList
            data={reviewsList}
            refreshing={isLoading}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={this.loadData}
            renderItem={({item}) => (
              <Review
                data={item}
                onPress={() =>
                  navigate('ReviewDetail', {
                    id: item.id,
                    backFunction: this.loadData,
                  })
                }
              />
            )}
          />
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
    padding: 15,
  },
  heading: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 30,
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
    fontSize: 16,
    color: '#000000',
  },
});
