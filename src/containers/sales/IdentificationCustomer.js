import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {t} from '../../services/i18n';
import TextInputMask from 'react-native-text-input-mask';
import {API, CheckCodeConsumer} from '../../services';

export default class IdentificationCustomer extends Component {
  state = {
    phone: '',
    recipeIdForSale: null,
    dataRecipeForSale: null,
  };

  componentDidMount() {
    if (
      this.props.params !== undefined &&
      this.props.params.hasOwnProperty('recipeId')
    ) {
      const {recipeId} = this.props.navigation.state.params;

      this.setState({
        recipeIdForSale: recipeId,
      });
    }

    if (
      this.props.params !== undefined &&
      this.props.params.hasOwnProperty('dataRecipeForSale')
    ) {
      const {dataRecipeForSale} = this.props.params;

      this.setState({
        dataRecipeForSale: dataRecipeForSale,
      });
    }
  }

  navigateSaleWithPhone = () => {
    const {navigate} = this.props.navigation;
    const {phone, recipeIdForSale, dataRecipeForSale} = this.state;

    if (phone !== '') {
      CheckCodeConsumer(API.qr, {phone: phone}).then(response => {
        response.purchaseId = null;
        response.recipeIdForSale = recipeIdForSale || null;
        response.dataRecipeForSale = dataRecipeForSale || null;
        response.statusForBonus = false;
        this.setState({phone: ''});
        navigate('SaleByShare', response);
        Keyboard.dismiss();
      });
    } else {
      Alert.alert('', t('Invalid data, repeat again'), [
        {
          text: 'OK',
          onPress: () => {
            this.setState({phone: ''});
          },
        },
      ]);
    }
  };

  navigateSale = () => {
    const {navigate} = this.props.navigation;

    const {recipeIdForSale, dataRecipeForSale} = this.state;

    let response = {
      phone: '',
      bonus: 0,
      purchaseId: null,
      recipeIdForSale: recipeIdForSale || null,
      dataRecipeForSale: dataRecipeForSale || null,
      statusForBonus: false,
    };
    navigate('SaleByShare', response);
    this.setState({phone: ''});
    Keyboard.dismiss();
  };

  navigateToQRCode = () => {
    const {navigate} = this.props.navigation;
    const {recipeIdForSale, dataRecipeForSale} = this.state;

    navigate('QRcode', {
      purchaseId: null,
      recipeIdForSale: recipeIdForSale || null,
      dataRecipeForSale: dataRecipeForSale || null,
      statusForBonus: true,
    });
    this.setState({phone: ''});
    Keyboard.dismiss();
  };

  handleChangeMaskedInput = (formatted, extracted) => {
    this.setState({phone: `+38${extracted}`});
  };

  render() {
    const {phone} = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>{t('Customer Identification')}</Text>
        <Text style={styles.label}>{t('Enter phone number')}</Text>
        <TextInputMask
          onChangeText={this.handleChangeMaskedInput}
          mask={'+38 ([000]) [000] [00] [00]'}
          ref="phone"
          style={styles.input}
          value={phone}
          keyboardType="phone-pad"
          placeholder={t('Phone')}
          defaultValue="+38 ("
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity
          onPress={this.navigateSaleWithPhone}
          style={styles.simpleButtons}>
          <Text style={styles.simpleButtonText}>
            {t('Continue').toUpperCase()}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{paddingTop: 10}}>
            <TouchableOpacity
              onPress={this.navigateToQRCode}
              style={styles.simpleButtons}>
              <Text style={styles.simpleButtonText}>
                {t('Scan gr code').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingTop: 10}}>
            <TouchableOpacity
              style={[styles.simpleButtons, {backgroundColor: '#000000'}]}
              onPress={this.navigateSale}>
              <Text style={styles.simpleButtonText}>
                {t('Skip').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    marginBottom: 20,
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
    fontSize: 16,
    color: '#fff',
  },
  input: {
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
