import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import moment from 'moment/moment';

import Loader from '../../components/Loader';
import {MotivationBlock} from '../../components/MotivationBlock';

import {getCurrentStore} from '../../services/store';
import {fetchDetails, API} from '../../services';
import Logo from '../../images/logo.png';

import {t} from '../../services/i18n';

export class Salary extends Component {
  state = {
    data: [],
    selectedMonth: '',
    isLoading: true,
    currentStore: {id: ''},
    months: [],
    calculatedMonthSalary: 0,
    isNotMonthEmpty: false,
    isLoadingList: true,
  };

  componentDidMount() {
    getCurrentStore().then(response => {
      let months = [];
      for (let i = 0; i < 6; i++) {
        let iter_month = moment()
          .subtract(i, 'months')
          .format('MMM YYYY')
          .split(' ');
        months.push({
          key: `month_index${i}`,
          idMonth: i,
          label: `${t(iter_month[0])} ${iter_month[1]}`,
        });
      }

      this.setState(
        {
          currentStore: response,
          months: months,
          selectedMonth: months[0],
          isLoading: false,
        },
        () => this.getData(),
      );
    });
  }

  getData = () => {
    const {selectedMonth} = this.state;

    this.setState({
      isLoadingList: true,
    });

    fetchDetails(API.salary.salaries, selectedMonth.idMonth)
      .then(response => {
        let isNotMonthEmpty = false,
          totalSalary = 0;
        response.map(item => {
          isNotMonthEmpty = isNotMonthEmpty || !!item.store;
          totalSalary = totalSalary + parseFloat(item.salary);
        });

        this.setState({
          data: response,
          calculatedMonthSalary: totalSalary.toFixed(2),
          isNotMonthEmpty: isNotMonthEmpty,
          isLoadingList: false,
        });
      })
      .catch(error => console.warn('error', error));
  };

  render() {
    const {
      currentStore,
      isLoading,
      data,
      calculatedMonthSalary,
      isNotMonthEmpty,
      isLoadingList,
      months,
      selectedMonth,
    } = this.state;

    const listSalaries = data.map((item, index) => (
      <SalaryItem key={`salary_index_list${index}`} {...item} />
    ));
    if (isLoading) {
      return <Loader />;
    }

    return (
      <ScrollView style={styles.salaryListWrapper}>
        <View style={styles.motivationBlockWrapper}>
          <MotivationBlock currentStore={currentStore.id} />
        </View>
        <View style={styles.monthPickerContainer}>
          <ModalSelector
            cancelStyle={{height: 35}}
            cancelTextStyle={{height: 25}}
            data={months}
            cancelText={t('Cancel')}
            optionTextStyle={{color: '#000'}}
            onChange={option => {
              this.setState(
                {
                  selectedMonth: option,
                },
                () => this.getData(),
              );
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                width: '100%',
              }}>
              {/*<Text style={styles.defText}>{t('Choose a month')}</Text>*/}
              <View style={styles.handlerToPickMonth}>
                <Text style={styles.handlerToPickMonthText}>
                  {selectedMonth.label}
                </Text>
              </View>
            </View>
          </ModalSelector>
        </View>
        <SalariesList
          isLoadingList={isLoadingList}
          data={listSalaries}
          isNotMonthEmpty={isNotMonthEmpty}
          calculatedMonthSalary={calculatedMonthSalary}
        />
      </ScrollView>
    );
  }
}

const SalariesList = props => {
  const {data, isNotMonthEmpty, isLoadingList, calculatedMonthSalary} = props;

  if (isLoadingList) {
    return <Loader />;
  } else {
    if (!isNotMonthEmpty) {
      return (
        <View style={styles.salaryListContainer}>
          <Text
            style={[
              styles.defText,
              {fontWeight: 'bold', fontSize: 25, marginTop: 20},
            ]}>
            {t('No result')}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.salaryListContainer}>
        {data}
        <View style={styles.footerOfList}>
          <Text
            style={[styles.defText, {textAlign: 'right', fontWeight: 'bold'}]}>
            {t('Result')}: {calculatedMonthSalary} {t('UAH')}
          </Text>
        </View>
      </View>
    );
  }
};

const SalaryItem = props => {
  const {day, salary, store} = props;

  return (
    <View style={styles.salaryListItem}>
      <Text style={styles.defText}>{day}</Text>
      {store ? (
        <View style={styles.rowContainer}>
          <Image
            source={
              Platform.OS === 'ios'
                ? Logo
                : {uri: 'asset:/images/logo_android.png'}
            }
            style={styles.shopLogo}
          />
          <Text style={styles.defText}>{store}</Text>
        </View>
      ) : (
        <View style={styles.rowContainer}>
          <Text style={styles.defText}>-</Text>
        </View>
      )}
      <Text style={[styles.defText, {width: 120, textAlign: 'right'}]}>
        {salary} {t('UAH')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  salaryListWrapper: {
    backgroundColor: '#fff',
    // padding: 5
  },
  motivationBlockWrapper: {
    backgroundColor: 'rgb(45, 153, 70)',
    padding: 5,
    paddingBottom: 15,
    alignItems: 'center',
  },
  salaryListContainer: {
    padding: 5,
    alignItems: 'center',
  },
  salaryListItem: {
    width: '100%',
    borderRadius: 7,
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  shopLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  defText: {
    color: '#000',
    fontSize: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '58%',
    alignItems: 'center',
  },
  dayIndex: {
    marginRight: 10,
  },
  handlerToPickMonth: {
    backgroundColor: '#000',
    padding: 7,
    width: 200,
    borderRadius: 7,
    borderWidth: 1,
  },
  handlerToPickMonthText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  monthPickerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  footerOfList: {
    width: '100%',
    padding: 10,
    backgroundColor: '#ededed',
  },
});
