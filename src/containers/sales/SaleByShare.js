import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Keyboard,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import ModalSelector from 'react-native-modal-selector';
import TextInputMask from 'react-native-text-input-mask';
import Autocomplete from 'react-native-autocomplete-input';

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

import {HEIGHT} from '../../services';

import {getCurrentStore} from '../../services/store';
import theme from '../../styles';
import {t} from '../../services/i18n';
import {MotivationBlock} from '../../components/MotivationBlock';

class SaleByShare extends Component {
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
                      key: index + 1,
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
                    key: index + 1,
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

  addRowItem(key) {
    let newData = this.state[key];

    if (key === 'dataScent') {
      newData.push({
        key: this.state[key].length + 1,
        product: '',
        quantity: 0,
        price: 0,
        forScent: '',
        heightDropdownList: 0,
      });
    } else {
      newData.push({
        key: this.state[key].length + 1,
        product: '',
        quantity: '',
        price: '',
      });
    }
    this.setState({[key]: newData});
  }

  deleteRowItem(key, index) {
    let newData = this.state[key];
    newData.splice(index, 1);
    this.setState({[key]: newData});
  }

  inputValuePicker(id) {
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
  }

  showErrors(error) {
    Alert.alert(t('Error'), error);
  }

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
          if (item.price === '' || item.product === '' || item.quantity === 0) {
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

  findScent(scent, scentsList) {
    if (scent === '') {
      return [];
    }
    const regex = new RegExp(`${scent.trim()}`, 'i');
    if (scentsList) {
      return scentsList.filter(scent => scent.title.match(regex));
    } else {
      return [];
    }
  }

  getNewScents = string => {
    if (string) {
      fetchListWithGetParams(API.sale.scent, `?search=${string}`)
        .then(response => {
          this.setState({
            scents: response,
          });
        })
        .catch(error => console.warn('error', error));
    }
  };

  render() {
    if (this.props.navigation.state.params.hasOwnProperty('backFunction')) {
      this.props.navigation.state.params.backFunction();
    }

    const self = this;
    const {scent, isLoading, currentStore, alertVisible} = this.state;
    const selfScents = this.state.scents;
    const comp = (a, b) => a.trim() === b.trim();

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
                      (item.product = extracted)
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
                      item.quantity = parseInt(text);
                    }}
                  />

                  <TextInput
                    keyboardType="numeric"
                    placeholder={t('Price')}
                    style={styles.inputRow}
                    underlineColorAndroid="transparent"
                    onChangeText={text => {
                      item.price = parseFloat(text.replace(',', '.'));
                      this.amount(this.state.usedBonus);
                    }}
                  />
                  <TouchableOpacity
                    style={theme.simpleButtonDelete}
                    onPress={() => {
                      this.deleteRowItem('dataPerfume', index);
                      this.amount(this.state.usedBonus);
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
                      onChange={option => {
                        item.inputValue = option.bottle;
                        item.product = option.id;
                        this.setState({tmp: option.id});
                      }}>
                      <Text style={styles.inputRowPicker}>
                        {this.inputValuePicker(item.product)}
                      </Text>
                    </ModalSelector>
                  </View>
                  <View style={styles.rowForm}>
                    <TextInputMask
                      mask={'[99999]'}
                      keyboardType="numeric"
                      placeholder={t('Qty')}
                      style={[styles.inputRow, {width: '35%'}]}
                      underlineColorAndroid="transparent"
                      onChangeText={text => {
                        item.quantity = parseInt(text);
                      }}
                    />

                    <TextInput
                      keyboardType="numeric"
                      placeholder={t('Price')}
                      style={[styles.inputRow, {width: '35%'}]}
                      underlineColorAndroid="transparent"
                      onChangeText={text => {
                        item.price = parseFloat(text.replace(',', '.'));
                        this.amount(this.state.usedBonus);
                      }}
                    />

                    <TouchableOpacity
                      style={theme.simpleButtonDelete}
                      onPress={() => {
                        this.deleteRowItem('dataBottle', index);
                        this.amount(this.state.usedBonus);
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

            <Text style={styles.underHeading}>{t('A list of PB')}</Text>

            <FlatList
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item, index) => index.toString()}
              data={this.state.dataScent}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.columnForm}>
                    <View style={styles.autoComplete}>
                      <Autocomplete
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="numeric"
                        style={styles.autoCompleteInput}
                        containerStyle={[
                          styles.autocompleteContainer,
                          {height: item.heightDropdownList},
                        ]}
                        inputContainerStyle={{borderWidth: 0}}
                        data={
                          self.findScent(scent, item.scentsList).length === 1 &&
                          comp(
                            scent,
                            self.findScent(scent, item.scentsList)[0].title,
                          )
                            ? []
                            : self.findScent(scent, item.scentsList)
                        }
                        // data={scent ? this.state.scents : []}
                        defaultValue={item.forScent}
                        underlineColorAndroid="transparent"
                        onChangeText={text => {
                          // this.setState({scent: text}, () => this.getNewScents(text));
                          this.setState({scent: text});
                          if (text.length > 0 && text.indexOf('мл') === -1) {
                            item.scentsList = selfScents;
                          }
                        }}
                        placeholder={t('PB')}
                        listContainerStyle={{
                          position: 'relative',
                          // top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 2,
                        }}
                        renderItem={({title, id, amount, price}) => {
                          let countList = self.findScent(
                            scent,
                            item.scentsList,
                          ).length;
                          item.heightDropdownList =
                            self.findScent(scent, item.scentsList).length * 35 +
                            36;
                          let e = this.state.eventCounter;
                          this.setState({eventCounter: e++});

                          return (
                            <TouchableOpacity
                              style={{borderWidth: 0}}
                              onPress={() => {
                                this.setState({scent: ''});
                                item.heightDropdownList = 0;
                                item.forScent = title;
                                item.product = id;
                                item.quantity = 1;
                                item.amount = amount;
                                item.defPrice = parseFloat(
                                  parseFloat(price).toFixed(2),
                                );
                                item.price = parseFloat(
                                  parseFloat(price).toFixed(2),
                                );
                                item.scentsList = [];
                                this.amount(this.state.usedBonus);
                              }}>
                              <Text style={styles.itemText}>{title}</Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
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
                          if (text.length > 0) {
                            item.quantity = parseInt(text);
                          } else {
                            item.quantity = 1;
                          }
                          item.price = (item.quantity * item.defPrice).toFixed(
                            2,
                          );
                          this.setState({scent: ''});
                          this.amount(this.state.usedBonus);
                        }}
                      />

                      <Text style={[styles.inputRowText, {width: '35%'}]}>
                        {' '}
                        {item.price}{' '}
                      </Text>

                      <TouchableOpacity
                        style={theme.simpleButtonDelete}
                        onPress={() => {
                          this.deleteRowItem('dataScent', index);
                          this.amount(this.state.usedBonus);
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
    borderBottomWidth: 1,
  },
});

export default SaleByShare;
