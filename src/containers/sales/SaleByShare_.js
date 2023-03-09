import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableHighlight,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import TextInputMask from 'react-native-text-input-mask';
import ModalSelector from 'react-native-modal-selector';

import {MotivationBlock} from '../../components/MotivationBlock';
import Loader from '../../components/Loader';
import {HocIOS} from '../../HOC/hocIOS';

import {
  API,
  fetchList,
  fetchListWithGetParams,
  createSale,
  setRoutePurchasesList,
  fetchDetails,
} from '../../services';
import {getCurrentStore} from '../../services/store';

import theme from '../../styles';
import {t} from '../../services/i18n';
import {HEIGHT} from '../../services';

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export default class SaleByShare_ extends Component {
  constructor(props) {
    super();

    const {state} = props.navigation;

    this.state = {
      isLoading: true,
      totalAmount: 0,
      usedBonus: 0,
      tmp: 0,
      bottles: [],
      dataPerfume: [],
      dataBottle: [],
      dataScent: [],
      consumer: {
        phone: state.params.phone,
        bonus: state.params.bonus,
      },
      share: state.params.purchaseId,
      scent: '',
      eventCounter: 0,
      currentStore: {id: ''},
      alertVisible: false,
    };
  }

  componentDidMount() {
    fetchList(API.sale.bottles)
      .then(bottles => {
        fetchList(API.sale.scent)
          .then(scents => {
            if (
              this.props.navigation.state.params !== undefined &&
              this.props.navigation.state.params.hasOwnProperty(
                'recipeIdForSale',
              ) &&
              this.props.navigation.state.params.recipeIdForSale !== null
            ) {
              const {recipeIdForSale} = this.props.navigation.state.params;

              fetchDetails(API.recipes, recipeIdForSale)
                .then(response => {
                  let recipeData = [];

                  response.components.forEach((item, index) => {
                    recipeData.push({
                      key: getRandomInt(9999),
                      product: item.perfume_code,
                      quantity: item.amount,
                      price: '',
                    });
                  });

                  bottles.forEach((item, index) => {
                    item.key = index;
                    item.label = item.bottle;
                  });

                  this.setState({
                    isLoading: false,
                    bottles: bottles,
                    scents: scents,
                    dataPerfume: recipeData,
                  });
                })
                .catch(error => console.warn('error', error));
            } else {
              if (
                this.props.navigation.state.params !== undefined &&
                this.props.navigation.state.params.hasOwnProperty(
                  'dataRecipeForSale',
                ) &&
                this.props.navigation.state.params.dataRecipeForSale !== null
              ) {
                const {dataRecipeForSale} = this.props.navigation.state.params;

                let recipeData = [];

                dataRecipeForSale.forEach((item, index) => {
                  recipeData.push({
                    key: getRandomInt(9999),
                    product: item.perfume_code,
                    quantity: item.amount,
                    price: '',
                  });
                });

                bottles.forEach((item, index) => {
                  item.key = index;
                  item.label = item.bottle;
                });

                this.setState({
                  isLoading: false,
                  bottles: bottles,
                  scents: scents,
                  dataPerfume: recipeData,
                });
              } else {
                bottles.forEach((item, index) => {
                  item.key = index;
                  item.label = item.bottle;
                });

                this.setState({
                  isLoading: false,
                  bottles: bottles,
                  scents: scents,
                });
              }
            }
          })
          .catch(error => console.warn('error', error));
      })
      .catch(error => console.warn('error', error));

    getCurrentStore().then(response => {
      this.setState({
        currentStore: response,
      });
    });
  }

  addRowItem = key => {
    if (key === 'dataPerfume') {
      this.setState(({dataPerfume}) => ({
        dataPerfume: dataPerfume.concat({
          // key: this.state[key].length + 1,
          key: getRandomInt(9999),
          product: '',
          quantity: '',
          price: '',
        }),
      }));
    }

    if (key === 'dataBottle') {
      this.setState(({dataBottle}) => ({
        dataBottle: dataBottle.concat({
          // key: this.state[key].length + 1,
          key: getRandomInt(9999),
          inputValue: '',
          product: '',
          quantity: '',
          price: '',
        }),
      }));
    }

    if (key === 'dataScent') {
      this.setState(({dataScent}) => ({
        dataScent: dataScent.concat({
          // key: this.state[key].length + 1,
          key: getRandomInt(9999),
          product: '',
          quantity: 0,
          price: 0,
          forScent: '',
          itemScents: [],
          heightDropdownList: 0,
        }),
      }));
    }
  };

  changeValueForPerfumes = (index, key, value) => {
    this.setState(({dataPerfume}) => ({
      dataPerfume: dataPerfume.map(item =>
        item.key === index ? {...item, [key]: value} : {...item},
      ),
    }));
  };

  changeValueForBottles = (index, key, value) => {
    this.setState(({dataBottle}) => ({
      dataBottle: dataBottle.map(item =>
        item.key === index
          ? {
              ...item,
              [key]: value.hasOwnProperty('id') ? value.id : value,
              inputValue: value.hasOwnProperty('id')
                ? value.bottle
                : item.inputValue,
            }
          : {...item},
      ),
    }));
  };

  handlerForScent = (scentId, option) => {
    this.setState(({dataScent}) => ({
      dataScent: dataScent.map(item =>
        item.key === scentId
          ? {
              ...item,
              forScent: option.title,
              product: option.id,
              price: parseFloat(parseFloat(option.price).toFixed(2)),
              defPrice: parseFloat(parseFloat(option.price).toFixed(2)),
              itemScents: [],
            }
          : {...item},
      ),
    }));
  };

  deleteRowItem = (key, index) => {
    const {usedBonus} = this.state;

    if (key === 'dataPerfume') {
      this.setState(
        ({dataPerfume}) => ({
          dataPerfume: dataPerfume.filter(item => item.key !== index),
        }),
        () => this.amount(usedBonus),
      );
    }

    if (key === 'dataBottle') {
      this.setState(
        ({dataBottle}) => ({
          dataBottle: dataBottle.filter(item => item.key !== index),
        }),
        () => this.amount(usedBonus),
      );
    }

    if (key === 'dataScent') {
      this.setState(
        ({dataScent}) => ({
          dataScent: dataScent.filter(item => item.key !== index),
        }),
        () => this.amount(usedBonus),
      );
    }
  };

  inputValuePicker = id => {
    let value = '';
    if (id > 0) {
      this.state.bottles.forEach(function (item) {
        if (item.id === id) {
          value = item.bottle;
        }
      });
    } else {
      value = t('Bottle');
    }
    return value;
  };

  onChangeInputScentSearch = (text, key) => {
    this.setState(
      ({dataScent}) => ({
        dataScent: dataScent.map(item =>
          item.key === key ? {...item, forScent: text} : {...item},
        ),
      }),
      () => this.getNewScents(text, key),
    );
  };

  onChangeQuantityScents = (int, key) => {
    this.setState(({dataScent}) => ({
      dataScent: dataScent.map(item =>
        item.key === key
          ? {...item, quantity: int, price: int * parseFloat(item.defPrice)}
          : {...item},
      ),
    }));
  };

  getNewScents = (string, key) => {
    if (string) {
      fetchListWithGetParams(API.sale.scent, `?search=${string}`)
        .then(response => {
          this.setState(({dataScent}) => ({
            dataScent: dataScent.map(item =>
              item.key === key ? {...item, itemScents: response} : {...item},
            ),
          }));
        })
        .catch(error => console.warn('error', error));
    }
  };

  showErrors = error => {
    Alert.alert(t('Error'), error);
  };

  amount = usedBonus => {
    let totalAmount = 0;
    const {dataPerfume, dataBottle, dataScent} = this.state;

    dataPerfume.forEach(item => {
      totalAmount = totalAmount + item.price;
    });

    dataBottle.forEach(item => {
      totalAmount = totalAmount + item.price;
    });

    dataScent.forEach(item => {
      totalAmount = totalAmount + item.price;
    });

    if (totalAmount >= 0) {
      if (usedBonus >= 0) {
        totalAmount = totalAmount - usedBonus;
      }
      this.setState({totalAmount: totalAmount.toFixed(2), errorAmount: false});
    } else {
      this.setState({totalAmount: 0.0, errorAmount: true});
    }
  };

  postData = () => {
    const {
      dataPerfume,
      dataBottle,
      dataScent,
      consumer,
      usedBonus,
      totalAmount,
      share,
    } = this.state;

    let statusError = false,
      placeError = '';

    if (
      dataPerfume.length === 0 &&
      dataBottle.length === 0 &&
      dataScent.length === 0
    ) {
      this.showErrors(t('No data available'));
      statusError = true;
    } else {
      if (dataPerfume.length > 0) {
        dataPerfume.forEach(function (item) {
          if (item.price === '' || !item.product || !item.quantity) {
            statusError = true;
            placeError = 'perfume';
          }
        });
      }

      if (usedBonus > consumer.bonus) {
        statusError = true;
        placeError = 'bonus';
      }

      if (dataBottle.length > 0) {
        dataBottle.forEach(function (item) {
          if (
            item.price === '' ||
            item.product === '' ||
            item.quantity === 0 ||
            item.quantity === ''
          ) {
            statusError = true;
            placeError = 'bottle';
          }
        });
      }

      if (dataScent.length > 0) {
        dataScent.forEach(function (item) {
          if (item.price === '' || item.product === '' || item.quantity === 0) {
            statusError = true;
            placeError = 'scent';
          }
        });
      }

      if (statusError) {
        if (placeError === 'bottle') {
          this.showErrors(t('Missing data in the vial list'));
        }
        if (placeError === 'bonus') {
          this.showErrors(t('There are not enough bonuses'));
        }
        if (placeError === 'perfume') {
          this.showErrors(t('Missing data in the list of perfumes'));
        }
        if (placeError === 'scent') {
          this.showErrors(t('Missing data in the list of PB'));
        }
      }
    }

    if (statusError === false) {
      let dataRequest,
        bonus = 0;

      if (usedBonus > 0) {
        bonus = usedBonus;
      }

      const perfumes = dataPerfume.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      }));

      const bottles = dataBottle.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      }));

      const scents = dataScent.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      }));

      let totalSum = parseFloat(totalAmount) + bonus;

      dataRequest = {
        phone: consumer.phone,
        promo: share,
        bonus: bonus,
        perfumes: perfumes,
        bottles: bottles,
        your_scents: scents,
        total: totalAmount,
        sum: totalSum.toFixed(2),
      };

      let url = API.sale.simple;

      if (this.state.share) {
        url = API.sale.share;
      }

      createSale(url, dataRequest).then(response => {
        if (response.hasOwnProperty('non_field_errors')) {
          let percent = parseInt(response.non_field_errors[0], 10);
          this.showErrors(t('Maximum of bonuses: ') + percent + '%');
        } else {
          if (response) {
            Keyboard.dismiss();

            this.setState({
              alertVisible: true,
            });
          } else {
            if (response.hasOwnProperty('quantity')) {
              this.showErrors(t('Missing quantity of goods'));
            }
            if (response.hasOwnProperty('price')) {
              this.showErrors(t('Missing product price'));
            }
          }
        }
      });
    }
  };

  navigateToPurchases = () => {
    const {navigate} = this.props.navigation;

    this.setState(
      {
        alertVisible: false,
      },
      () => navigate('PurchasesList'),
    );
  };

  navigateToHome = () => {
    this.setState(
      {
        alertVisible: false,
      },
      () =>
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
    );
  };

  render() {
    if (this.props.navigation.state.params.hasOwnProperty('backFunction')) {
      this.props.navigation.state.params.backFunction();
    }

    const {statusForBonus} = this.props.navigation.state.params;

    const {scent, isLoading, currentStore, alertVisible} = this.state;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <Modal animationType="fade" transparent={true} visible={alertVisible}>
          <View
            style={[
              theme.alertWrapper,
              {height: HEIGHT, backgroundColor: 'rgba(0, 0, 0, 0.2)'},
            ]}>
            <View style={theme.alertContainer}>
              <Text style={[theme.alertDefText, theme.alertTextHeader]}>
                {t('Sold successfully')}
              </Text>
              <MotivationBlock currentStore={currentStore.id} />
              <View
                style={[
                  theme.alertContainerRow,
                  {backgroundColor: 'gray', borderRadius: 7},
                ]}>
                <TouchableHighlight
                  underlayColor="rgb(45, 153, 70)"
                  style={[
                    theme.alertContainerBtn,
                    {
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      marginRight: 1,
                      // borderColor: 'gray',
                    },
                  ]}
                  onPress={this.navigateToPurchases}>
                  <Text style={theme.alertContainerBtnText}>ОК</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="rgb(45, 153, 70)"
                  style={[
                    theme.alertContainerBtn,
                    {
                      // borderLeftWidth: 1,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    },
                  ]}
                  onPress={this.navigateToHome}>
                  <Text style={theme.alertContainerBtnText}>На головну</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <HocIOS>
          <View>
            <Text style={styles.heading}>{t('Sale of goods')}</Text>

            {/*PERFUMES*/}
            <Text style={styles.underHeading}>{t('List of perfumes')}</Text>
            <FlatList
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item, index) => index.toString()}
              data={this.state.dataPerfume}
              renderItem={({item, index}) => (
                <View style={styles.rowForm}>
                  <TextInputMask
                    mask={'[000]'}
                    value={item.product}
                    keyboardType="numeric"
                    placeholder="ID"
                    style={styles.inputRow}
                    underlineColorAndroid="transparent"
                    onChangeText={(formatted, extracted) =>
                      this.changeValueForPerfumes(
                        item.key,
                        'product',
                        extracted,
                      )
                    }
                  />

                  <TextInputMask
                    mask={'[99999]'}
                    keyboardType="numeric"
                    placeholder={t('Qty')}
                    value={item.quantity}
                    style={styles.inputRow}
                    underlineColorAndroid="transparent"
                    onChangeText={text => {
                      this.changeValueForPerfumes(
                        item.key,
                        'quantity',
                        parseInt(text),
                      );
                    }}
                  />

                  <TextInputMask
                    mask={'[99999].[99]'}
                    keyboardType="numeric"
                    placeholder={t('Price')}
                    value={item.price}
                    style={styles.inputRow}
                    underlineColorAndroid="transparent"
                    onChangeText={text => {
                      this.changeValueForPerfumes(
                        item.key,
                        'price',
                        text !== '' ? parseFloat(text.replace(',', '.')) : text,
                      );
                      this.amount(this.state.usedBonus);
                    }}
                  />

                  <TouchableOpacity
                    style={theme.simpleButtonDelete}
                    onPress={() => {
                      this.deleteRowItem('dataPerfume', item.key);
                      // this.amount(this.state.usedBonus);
                    }}>
                    <Icon color="#fff" name="trash" size={16} />
                  </TouchableOpacity>
                </View>
              )}
              extraData={this.state}
            />
            <TouchableOpacity
              style={styles.simpleButton}
              onPress={() => this.addRowItem('dataPerfume')}>
              <Text style={{color: '#fff'}}>{t('Add product')}</Text>
            </TouchableOpacity>

            {/*BOTTLES*/}
            <Text style={styles.underHeading}>{t('A list of bottles')}</Text>
            <FlatList
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item, index) => index.toString()}
              data={this.state.dataBottle}
              renderItem={({item, index}) => (
                <View style={styles.columnForm}>
                  <View style={{width: '100%'}}>
                    <ModalSelector
                      cancelStyle={{height: 35}}
                      cancelTextStyle={{height: 25}}
                      data={this.state.bottles}
                      cancelText={t('Cancel')}
                      optionTextStyle={{color: '#000'}}
                      onChange={option =>
                        this.changeValueForBottles(item.key, 'product', option)
                      }>
                      <Text style={styles.inputRowPicker}>
                        {item.inputValue}
                      </Text>
                    </ModalSelector>
                  </View>
                  <View style={styles.rowForm}>
                    <TextInputMask
                      mask={'[99999]'}
                      keyboardType="numeric"
                      value={item.quantity}
                      placeholder={t('Qty')}
                      style={[styles.inputRow, {width: '35%'}]}
                      underlineColorAndroid="transparent"
                      onChangeText={text => {
                        this.changeValueForBottles(
                          item.key,
                          'quantity',
                          parseInt(text),
                        );
                      }}
                    />

                    <TextInputMask
                      mask={'[99999].[99]'}
                      keyboardType="numeric"
                      placeholder={t('Price')}
                      value={item.price}
                      style={[styles.inputRow, {width: '35%'}]}
                      underlineColorAndroid="transparent"
                      onChangeText={text => {
                        this.changeValueForBottles(
                          item.key,
                          'price',
                          text !== ''
                            ? parseFloat(text.replace(',', '.'))
                            : text,
                        );
                        this.amount(this.state.usedBonus);
                      }}
                    />

                    <TouchableOpacity
                      style={theme.simpleButtonDelete}
                      onPress={() => {
                        this.deleteRowItem('dataBottle', item.key);
                        // this.amount(this.state.usedBonus);
                      }}>
                      <Icon color="#fff" name="trash" size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              extraData={this.state}
            />
            <TouchableOpacity
              style={styles.simpleButton}
              onPress={() => this.addRowItem('dataBottle')}>
              <Text style={{color: '#fff'}}>{t('Add bottle')}</Text>
            </TouchableOpacity>

            {/*PB*/}
            <Text style={styles.underHeading}>{t('A list of PB')}</Text>

            <FlatList
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item, index) => index.toString()}
              data={this.state.dataScent}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.columnForm}>
                    <View style={styles.autoComplete}>
                      <TextInput
                        keyboardType="default"
                        value={item.forScent}
                        style={styles.autoCompleteInput}
                        onChangeText={text =>
                          this.onChangeInputScentSearch(text, item.key)
                        }
                      />
                      <View
                        style={{
                          alignItems: 'center',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}>
                        {item.itemScents.map((scent, index) => (
                          <TouchableOpacity
                            key={`scent_index_${index}`}
                            style={{width: '90%'}}
                            onPress={() => {
                              this.handlerForScent(item.key, scent);
                              this.amount(this.state.usedBonus);
                            }}>
                            <Text style={styles.itemText}>{scent.title}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <View style={styles.rowForm}>
                      <TextInputMask
                        mask={'[99999]'}
                        keyboardType="numeric"
                        placeholder={t('Qty')}
                        style={[styles.inputRow, {width: '35%'}]}
                        value={item.quantity}
                        underlineColorAndroid="transparent"
                        onChangeText={text => {
                          let quantity_ = 1;
                          if (text.length > 0) {
                            quantity_ = parseInt(text);
                          }
                          this.onChangeQuantityScents(quantity_, item.key);
                          this.amount(this.state.usedBonus);
                        }}
                      />

                      <Text style={[styles.inputRowText, {width: '35%'}]}>
                        {' '}
                        {item.price ? `${item.price}.00` : item.price}{' '}
                      </Text>

                      <TouchableOpacity
                        style={theme.simpleButtonDelete}
                        onPress={() => {
                          this.deleteRowItem('dataScent', item.key);
                          // this.amount(this.state.usedBonus);
                        }}>
                        <Icon color="#fff" name="trash" size={16} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              extraData={this.state}
            />

            <TouchableOpacity
              style={styles.simpleButton}
              onPress={() => this.addRowItem('dataScent')}>
              <Text style={{color: '#fff'}}>{t('Add PB')}</Text>
            </TouchableOpacity>

            {statusForBonus ? (
              <Fragment>
                <Text>
                  {t('Available bonuses')}: {this.state.consumer.bonus}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 18, flex: 1, marginRight: 10}}>
                    {t('Use')}:
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder={t('Bonuses')}
                    defaultValue={this.state.usedBonus + ''}
                    style={styles.inputRow}
                    underlineColorAndroid="transparent"
                    onChangeText={text => {
                      if (text.length === undefined || text.length === 0) {
                        this.setState({usedBonus: 0});
                      } else {
                        this.setState({usedBonus: parseInt(text)});
                      }
                      this.amount(parseInt(text));
                    }}
                  />
                </View>
              </Fragment>
            ) : null}

            <Text
              style={{
                fontSize: 18,
                textAlign: 'right',
                marginBottom: 10,
              }}>
              {t('To pay')}: {this.state.totalAmount} {t('UAH')}
            </Text>
            <Text
              style={
                this.state.errorAmount
                  ? {fontSize: 14, textAlign: 'center', color: 'red'}
                  : {
                      fontSize: 14,
                      textAlign: 'center',
                      color: 'red',
                      display: 'none',
                    }
              }>
              {t('The price is not listed in all product')}
            </Text>

            <TouchableOpacity
              onPress={() => this.postData()}
              style={theme.simpleButton}>
              <Text style={theme.simpleButtonText}>
                {t('Checkout for Sale').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </HocIOS>
      </ScrollView>
    );
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
  rowForm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  columnForm: {
    flexDirection: 'column',
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
  inputRow: {
    width: '26%',
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 10,
    paddingLeft: 7,
    borderRadius: 4,
    paddingVertical: 0,
    paddingRight: 7,
    fontSize: 17,
  },
  inputRowText: {
    width: '30%',
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000000',
    backgroundColor: 'white',
    marginBottom: 10,
    paddingLeft: 7,
    paddingTop: 7,
    borderRadius: 4,
    paddingRight: 7,
    fontSize: 17,
  },
  underHeading: {
    fontSize: 18,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  simpleButton: {
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 30,
  },
  autoComplete: {
    marginBottom: 10,
    width: '100%',
    minHeight: 36,
  },
  autoCompleteInput: {
    height: 36,
    fontSize: 17,
    backgroundColor: 'white',
    paddingLeft: 7,
    paddingVertical: 0,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
  },
  autocompleteContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 15,
    height: 35,
    paddingLeft: 5,
    paddingTop: 5,
    borderBottomColor: '#ccc',
    color: '#000',
    borderBottomWidth: 1,
  },
});
