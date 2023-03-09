import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import ModalSelector from 'react-native-modal-selector';

import {
  API,
  fetchList,
  isLoggedIn,
  ForbiddenError,
  UnauthorizedError,
} from '../../services';
import {t} from '../../services/i18n';
import {getUserType, USER_TYPES, logout} from '../../services/auth';
import theme from '../../styles';
import moment from 'moment/moment';

class SaleListItem extends Component {
  render() {
    const {data} = this.props;
    let amountForDay = data.sales.reduce(
        (total, current) => total + parseFloat(current.total),
        0,
      ),
      amountBonusForDay = data.sales.reduce(
        (total, current) => total + current.bonus,
        0,
      ),
      amountSumForDay = data.sales.reduce(
        (total, current) => total + parseFloat(current.sum),
        0,
      );

    return (
      <View style={{width: '100%'}}>
        <Text style={styles.campaignNameLine}>{data.date}</Text>
        <FlatList
          data={data.sales}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.salesListItem}>
              <Text style={styles.campaignName}>
                <Text style={{fontWeight: 'bold'}}>{t('Sale')}:</Text>{' '}
                {item.promo ? item.promo : 'без акции'}
              </Text>

              {this.props.type === 1 ? (
                <Text style={styles.campaignName}>
                  <Text style={{fontWeight: 'bold'}}>{t('Seller')}:</Text>{' '}
                  {item.seller}
                </Text>
              ) : null}

              <Text style={styles.campaignName}>
                <Text style={{fontWeight: 'bold'}}>{t('Buyer')}:</Text>{' '}
                {item.phone}
              </Text>
              <FlatList
                data={item.products}
                style={{width: '100%'}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <View
                    style={{
                      paddingLeft: 15,
                      display: 'flex',
                      borderTopWidth: 1,
                      borderTopColor: '#ccc',
                      flexDirection: 'column',
                      alignContent: 'flex-start',
                      alignItems: 'flex-start',
                      backgroundColor: 'white',
                      width: '100%',
                    }}>
                    <Text style={styles.campaignName}>
                      <Text style={{fontWeight: 'bold'}}>{t('Goods')}: </Text>
                      {item.product}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.campaignName}>
                        <Text style={{fontWeight: 'bold'}}>{t('Qty')}: </Text>
                        {item.quantity}
                      </Text>
                      <Text style={styles.campaignName}>
                        <Text style={{fontWeight: 'bold'}}>{t('Price')}: </Text>
                        {item.price}
                      </Text>
                    </View>
                  </View>
                )}
              />
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: '#eee',
                  width: '100%',
                  flexWrap: 'wrap',
                }}>
                <Text style={styles.campaignName}>
                  <Text style={{fontWeight: 'bold'}}>{t('Sum')}:</Text>{' '}
                  {item.sum}
                </Text>
                <Text style={styles.campaignName}>
                  <Text style={{fontWeight: 'bold'}}>{t('Bonuses')}:</Text>{' '}
                  {item.bonus}
                </Text>
                <Text style={styles.campaignName}>
                  <Text style={{fontWeight: 'bold'}}>{t('Result')}:</Text>{' '}
                  {item.total}
                </Text>
              </View>
            </View>
          )}
        />
        <View style={styles.amountStyle}>
          <Text style={styles.amountStyleText}>
            {t('Sum')}: {amountSumForDay.toFixed(2)}
          </Text>
          <Text style={styles.amountStyleText}>
            {t('Bonuses')}: {amountBonusForDay}
          </Text>
          <Text style={styles.amountStyleText}>
            {t('Result')}: {amountForDay.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  }
}

export default class PurchaseList extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      isLoading: true,
      pickedDate_day: moment().format('DD'),
      pickedDate_month: moment().format('MM'),
      pickedDate_year: moment().format('YYYY'),
      days: [
        {
          key: '01',
          label: '01',
        },
        {
          key: '02',
          label: '02',
        },
        {
          key: '03',
          label: '03',
        },
        {
          key: '04',
          label: '04',
        },
        {
          key: '05',
          label: '05',
        },
        {
          key: '06',
          label: '06',
        },
        {
          key: '07',
          label: '07',
        },
        {
          key: '08',
          label: '08',
        },
        {
          key: '09',
          label: '09',
        },
        {
          key: '10',
          label: '10',
        },
        {
          key: '11',
          label: '11',
        },
        {
          key: '12',
          label: '12',
        },
        {
          key: '13',
          label: '13',
        },
        {
          key: '14',
          label: '14',
        },
        {
          key: '15',
          label: '15',
        },
        {
          key: '16',
          label: '16',
        },
        {
          key: '17',
          label: '17',
        },
        {
          key: '18',
          label: '18',
        },
        {
          key: '19',
          label: '19',
        },
        {
          key: '20',
          label: '20',
        },
        {
          key: '21',
          label: '21',
        },
        {
          key: '22',
          label: '22',
        },
        {
          key: '23',
          label: '23',
        },
        {
          key: '24',
          label: '24',
        },
        {
          key: '25',
          label: '25',
        },
        {
          key: '26',
          label: '26',
        },
        {
          key: '27',
          label: '27',
        },
        {
          key: '28',
          label: '28',
        },
        {
          key: '29',
          label: '29',
        },
        {
          key: '30',
          label: '30',
        },
        {
          key: '31',
          label: '31',
        },
      ],
      months: [
        {
          key: '01',
          label: '01',
        },
        {
          key: '02',
          label: '02',
        },
        {
          key: '03',
          label: '03',
        },
        {
          key: '04',
          label: '04',
        },
        {
          key: '05',
          label: '05',
        },
        {
          key: '06',
          label: '06',
        },
        {
          key: '07',
          label: '07',
        },
        {
          key: '08',
          label: '08',
        },
        {
          key: '09',
          label: '09',
        },
        {
          key: '10',
          label: '10',
        },
        {
          key: '11',
          label: '11',
        },
        {
          key: '12',
          label: '12',
        },
      ],
      years: [],
      pickedSeller: {
        id: 0,
        label: 'Всі продавці',
      },
      pickedCity: {
        id: 0,
        label: 'Всі міста',
      },
    };
  }

  componentDidMount() {
    getUserType().then(userType => {
      let years = [],
        defaultYear = parseInt(this.state.pickedDate_year, 10);
      while (defaultYear !== 2016) {
        years.push({
          key: defaultYear.toString(),
          label: defaultYear.toString(),
        });
        defaultYear--;
      }
      this.setState({user: userType, years: years});

      if (userType === 1) {
        fetchList(API.supervisor.locations).then(sup_locations => {
          fetchList(API.supervisor.sellers).then(response => {
            response.push({
              id: -1,
              label: 'Всі продавці',
              first_name: '',
              last_name: '',
              phone: 'Всі продавці',
            });

            sup_locations.forEach(function (location, index) {
              location.key = index;
              location.label = location.name;
            });
            sup_locations.push({id: -2, label: 'Всі міста'});

            response.forEach(function (item, index) {
              item.key = index;
              if (item.first_name !== '' && item.last_name !== '') {
                item.label = item.first_name + ' ' + item.last_name;
              } else {
                item.label = item.phone;
              }
            });
            this.setState({
              sellerList: response,
              super_locations: sup_locations,
              default_list: response,
            });
          });
        });
      }
    });

    this.loadData();
  }

  reloadData = () => {
    this.setState({isLoading: true});

    let defaultYear =
      this.state.pickedDate_day +
      this.state.pickedDate_month +
      this.state.pickedDate_year;
    if (this.state.user === 1) {
      const {pickedSeller} = this.state;

      if (pickedSeller.id > 0) {
        let params = pickedSeller.id + '/' + defaultYear;
        fetchList(API.supervisor.sellerSales, params).then(response =>
          this.setState({
            salesList: response,
            isLoading: false,
          }),
        );
      } else {
        fetchList(API.supervisor.sales, defaultYear).then(response =>
          this.setState({
            salesList: response,
            isLoading: false,
          }),
        );
      }
    } else {
      fetchList(API.seller.sales, defaultYear).then(response =>
        this.setState({
          salesList: response,
          isLoading: false,
        }),
      );
    }
  };

  inputValuePicker(id) {
    if (id > 0) {
      this.state.sellerList.forEach(function (item) {
        if (item.id === id) {
          this.setState({
            pickedSellerName: item.label,
          });
        }
      });
    } else {
      this.setState({
        pickedSellerName: 'Всі продавці',
      });
    }
  }

  inputValuePickerCity(id) {
    let defaultSellers = this.state.default_list,
      filteredList = [],
      self = this;
    if (id > 0) {
      this.state.super_locations.forEach(function (item) {
        if (item.id === id) {
          self.setState({
            pickedCityName: item.label,
          });
        }
      });
      filteredList = defaultSellers.filter(function (item) {
        return item.city === id;
      });
      this.setState({sellerList: filteredList});
    } else {
      self.setState({
        pickedCityName: 'Всі міста',
        sellerList: defaultSellers,
      });
    }
  }

  loadData = () => {
    getUserType()
      .then(userType => {
        return {
          [USER_TYPES.supervisor]: API.supervisor.sales,
          [USER_TYPES.seller]: API.seller.sales,
        }[userType];
      })
      .then(apiUrl => {
        if (!apiUrl) {
          throw new ForbiddenError();
        }
        let defaultYear =
          this.state.pickedDate_day +
          this.state.pickedDate_month +
          this.state.pickedDate_year;
        return fetchList(apiUrl, defaultYear);
      })
      .then(response => {
        this.setState({
          salesList: response,
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
    const {
      user,
      super_locations,
      pickedCity,
      sellerList,
      salesList,
      isLoading,
      pickedSeller,
      days,
      months,
      years,
      pickedDate_day,
      pickedDate_month,
      pickedDate_year,
    } = this.state;

    return (
      <View style={styles.container}>
        {user === 1 ? (
          <View>
            <Text style={{paddingLeft: 10, paddingRight: 10}}>
              {t('Choose city')}
            </Text>
            <ModalSelector
              data={super_locations}
              style={{paddingLeft: 10, paddingRight: 10}}
              cancelText={t('Cancel')}
              optionTextStyle={{color: '#000'}}
              onChange={option => {
                this.setState({pickedCity: option});
                this.inputValuePickerCity(option.id);
              }}>
              <Text style={styles.inputRowPicker}>{pickedCity.label}</Text>
            </ModalSelector>

            <Text style={{paddingLeft: 10, paddingRight: 10}}>
              {t('Choose seller')}
            </Text>
            <ModalSelector
              data={sellerList}
              style={{paddingLeft: 10, paddingRight: 10}}
              cancelText={t('Cancel')}
              optionTextStyle={{color: '#000'}}
              onChange={option => {
                this.setState({pickedSeller: option});
                // this.inputValuePicker(option.id);
                // this.reloadData(option.id);
              }}>
              <Text style={styles.inputRowPicker}>{pickedSeller.label}</Text>
            </ModalSelector>
          </View>
        ) : null}
        <View style={styles.rowFilter}>
          <ModalSelector
            data={days}
            style={{width: '30%'}}
            cancelText={t('Cancel')}
            optionTextStyle={{color: '#000'}}
            onChange={option => {
              this.setState({pickedDate_day: option.label});
            }}>
            <Text style={styles.inputRowPicker}>{pickedDate_day}</Text>
          </ModalSelector>

          <ModalSelector
            data={months}
            style={{width: '30%'}}
            cancelText={t('Cancel')}
            optionTextStyle={{color: '#000'}}
            onChange={option => {
              this.setState({pickedDate_month: option.label});
            }}>
            <Text style={styles.inputRowPicker}>{pickedDate_month}</Text>
          </ModalSelector>

          <ModalSelector
            data={years}
            style={{width: '30%'}}
            cancelText={t('Cancel')}
            optionTextStyle={{color: '#000'}}
            onChange={option => {
              this.setState({pickedDate_year: option.label});
            }}>
            <Text style={styles.inputRowPicker}>{pickedDate_year}</Text>
          </ModalSelector>
        </View>
        <View style={{padding: 10, paddingTop: 0}}>
          <TouchableOpacity
            onPress={this.reloadData}
            style={[theme.simpleButtons, {backgroundColor: '#6d96d6'}]}>
            <Text style={theme.simpleButtonText}>
              {t('Show').toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={salesList}
          refreshing={isLoading}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={() => this.loadData()}
          renderItem={({item}) => <SaleListItem data={item} type={user} />}
        />

        {user === 2 ? (
          <View style={{padding: 10}}>
            <TouchableOpacity
              onPress={() => navigate('Identification')}
              style={theme.simpleButtons}>
              <Text style={theme.simpleButtonText}>
                {t('Checkout for Sale').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15,
  },
  heading: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 30,
  },
  rowFilter: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowFilterInput: {
    width: '30%',
    height: 37,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  campaignListItem: {
    padding: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  inputRowPicker: {
    width: '100%',
    height: 36,
    lineHeight: 32,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 10,
    paddingLeft: 7,
    borderRadius: 4,
    paddingVertical: 0,
    paddingRight: 7,
    fontSize: 16,
  },
  salesListItem: {
    borderColor: '#ccc',
    margin: 5,
    borderWidth: 1,
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    width: '97%',
  },
  campaignName: {
    fontSize: 16,
    marginRight: 10,
    paddingLeft: 10,
  },
  campaignNameLine: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#ccc',
  },
  amountStyle: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    justifyContent: 'space-between',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    backgroundColor: '#ccc',
  },
  amountStyleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
