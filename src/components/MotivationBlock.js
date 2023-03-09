import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import Loader from './Loader';

import {API, fetchDetails} from '../services';

import {t} from '../services/i18n';

const calcMoneyProgress = (money, three_star) => {
  if (money / three_star >= 1) {
    return 100;
  } else {
    if ((money / three_star) * 100 <= 3) {
      return (money / three_star) * 100;
    } else {
      return (money / three_star) * 100 - 3;
    }
  }
};

export class MotivationBlock extends Component {
  state = {
    daily_plan: '',
    one_star: '',
    two_star: '',
    three_star: '',
    money: '',
    profit: '',
    currentStarShow: '',
    isLoading: true,
    errorFromServer: true,
  };

  componentDidMount() {
    if (this.props.currentStore) {
      fetchDetails(API.salary.motivationInfo, this.props.currentStore)
        .then(response => {
          if (response.hasOwnProperty('error')) {
            this.setState({
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
              errorFromServer: false,
              daily_plan: parseFloat(response.daily_plan),
              one_star: parseFloat(response.one_star),
              two_star: parseFloat(response.two_star),
              three_star: parseFloat(response.three_star),
              money: parseFloat(response.money),
              profit: response.profit,
            });
          }
        })
        .catch(error => {
          console.warn('error', error);
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  toggleCurrentStar = value => {
    this.setState({
      currentStarShow: value,
    });
  };

  render() {
    const {
      one_star,
      two_star,
      three_star,
      money,
      daily_plan,
      currentStarShow,
      profit,
      errorFromServer,
      isLoading,
    } = this.state;

    if (isLoading) {
      return (
        <View style={styles.motivationContainer}>
          <Loader />
        </View>
      );
    }

    if (errorFromServer) {
      return (
        <View
          style={[styles.motivationContainer, styles.errorMotivationContainer]}>
          <Text style={styles.errorMotivationText}>
            {t('Motivation System Error')}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.motivationContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{t('Plan:')}</Text>
          <Text style={styles.defColorText}>
            {daily_plan} {t('UAH')}
          </Text>
        </View>
        <ProgressBarMoney
          toggleCurrentStar={this.toggleCurrentStar}
          currentStarShow={currentStarShow}
          one_star={one_star}
          two_star={two_star}
          three_star={three_star}
          money={money}
        />
        <View style={[styles.labelContainer, styles.sellerProfitText]}>
          <Text style={styles.labelText}>{t('Your profit:')}</Text>
          <Text style={styles.defColorText}>
            {profit} {t('UAH')}
          </Text>
        </View>
      </View>
    );
  }
}

const ProgressBarMoney = props => {
  const {
    one_star,
    two_star,
    three_star,
    money,
    toggleCurrentStar,
    currentStarShow,
  } = props;

  return (
    <View style={styles.lineProgressContainer}>
      <View style={styles.starsGroupPosition}>
        <StarWithValue
          money={money}
          percent={(one_star / three_star) * 100}
          value={one_star}
          toggleCurrentStar={toggleCurrentStar}
          indexStar={1}
          currentStarShow={currentStarShow}
        />
        <StarWithValue
          money={money}
          percent={(two_star / three_star) * 100}
          value={two_star}
          toggleCurrentStar={toggleCurrentStar}
          indexStar={2}
          currentStarShow={currentStarShow}
        />
        <StarWithValue
          money={money}
          percent={100}
          value={three_star}
          toggleCurrentStar={toggleCurrentStar}
          indexStar={3}
          currentStarShow={currentStarShow}
        />
      </View>
      <View style={styles.lineProgressContent}>
        <View style={styles.lineProgress} />
        <View
          style={[
            styles.lineProgress,
            {
              width: `${calcMoneyProgress(money, three_star)}%`,
              backgroundColor: 'rgb(45, 153, 70)',
              alignItems: 'flex-end',
              justifyContent: 'center',
              borderTopRightRadius: money / three_star >= 1 ? 7 : 0,
              borderBottomRightRadius: money / three_star >= 1 ? 7 : 0,
              borderWidth: 0,
              padding: 2,
            },
          ]}
        />
      </View>
      <View style={[styles.labelContainer, {marginTop: 28}]}>
        <Text style={styles.labelText}>{t('Current progress:')}</Text>
        <Text style={styles.defColorText}>
          {money} {t('UAH')}
        </Text>
      </View>
    </View>
  );
};

const StarWithValue = props => {
  const {percent, value, money, toggleCurrentStar, indexStar, currentStarShow} =
    props;
  return (
    <TouchableOpacity
      style={[styles.starPosition, {left: `${percent - 8}%`}]}
      onPress={() => toggleCurrentStar(indexStar)}>
      {currentStarShow === indexStar ? (
        <Text style={styles.starPositionText}>{value.toFixed(2)}</Text>
      ) : null}
      {/*<Text style={styles.starPositionText}>{value}</Text>*/}
      {money >= value ? (
        <Icon name="star" size={22} color="orange" />
      ) : (
        <Icon name="star-o" size={22} color="orange" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  motivationContainer: {
    height: 160,
    borderRadius: 7,
    width: '95%',
    marginTop: 10,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  errorMotivationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMotivationText: {
    color: '#000',
    fontSize: 19,
    fontWeight: 'bold',
  },
  defColorText: {
    color: '#000',
  },
  starsGroupPosition: {
    position: 'relative',
    left: -13,
    height: 45,
  },
  lineProgressContainer: {
    width: '93%',
  },
  currentMoneyProgress: {
    color: '#fff',
    fontWeight: 'bold',
  },
  starPosition: {
    minWidth: 60,
    minHeight: 43,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    top: 0,
  },
  starPositionText: {
    textAlign: 'center',
    color: '#000',
  },
  lineProgressContent: {
    position: 'relative',
    justifyContent: 'flex-end',
  },
  lineProgress: {
    borderRadius: 7,
    position: 'absolute',
    top: 0,
    // marginTop: 45,
    width: '100%',
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  labelContainer: {
    flexDirection: 'row',
  },
  labelText: {
    color: '#000',
    fontWeight: 'bold',
    marginRight: 5,
  },
  sellerProfitText: {
    marginTop: 10,
  },
});
