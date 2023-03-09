import React, {Component} from 'react';
import {View, ScrollView, Text, TouchableOpacity, Alert} from 'react-native';

import Loader from '../../components/Loader';
import {HocIOS} from '../../HOC/hocIOS';
import theme from '../../styles';
import {PHONENUMBER_PREFIX} from '../../config';
import {API, fetchList, createObject} from '../../services';
import {t} from '../../services/i18n';

import form from 'tcomb-form-native';
import LocationsFactory from '../../forms/LocationsFactory';
import phoneTemplate from '../../forms/phoneTemplate';

const Form = form.form.Form;

const Password = form.refinement(form.String, value => value.length >= 4),
  Phone = form.refinement(form.String, value => /^[0-9\-\+]{13}$/.test(value));

const Location = form.struct({
  id: form.Number,
  name: form.String,
  checked: form.Boolean,
});

const Seller = form.struct({
  first_name: form.maybe(form.String),
  last_name: form.maybe(form.String),
  phone: Phone,
  locations: form.list(Location),
  password: Password,
  confirm_password: Password,
});

const options = {
  fields: {
    first_name: {
      label: t('First name'),
    },
    last_name: {
      label: t('Last name'),
    },
    phone: {
      label: t('Phone'),
      // value: PHONENUMBER_PREFIX,
      // keyboardType: 'phone-pad'
      template: phoneTemplate,
    },
    locations: {
      label: t('City'),
      // factory: LocationsFactory,
    },
    password: {
      label: t('Password'),
      autoCapitalize: 'none',
      secureTextEntry: true,
    },
    confirm_password: {
      label: t('Confirm password'),
      autoCapitalize: 'none',
      secureTextEntry: true,
    },
  },
};

export default class CreateSeller extends Component {
  state = {
    values: {
      phone: PHONENUMBER_PREFIX,
      first_name: '',
      last_name: '',
      password: '',
      locations: [],
      confirm_password: '',
    },
    isLoading: true,
  };

  componentDidMount() {
    fetchList(API.supervisor.locations)
      .then(locations =>
        locations.map(location => {
          console.log('location', location);
          location.checked = false;
          return location;
        }),
      )
      .then(locations => {
        const {phone, first_name, last_name, password, confirm_password} =
          this.state;

        this.setState({
          values: {
            phone: phone,
            first_name: first_name,
            last_name: last_name,
            password: password,
            confirm_password: confirm_password,
            locations: locations,
          },
          isLoading: false,
        });
      });
  }

  postData = () => {
    let user = this.refs.form.getValue();
    if (user) {
      // Check if passwords are equal
      if (user.password === user.confirm_password) {
        let data = {
          phone: user.phone,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          password: user.password,
          city: user.locations[0].id,
        };

        this.setState({
          values: user,
        });

        createObject(API.supervisor.sellers, data)
          .then(() => {
            this.props.navigation.navigate('SellersList');
          })
          .catch(error => {
            // FIXME: refactor error messages
            console.warn('error', error);
            if ('message' in error) {
              if ('phone' in error.message) {
                if (
                  error.message.phone[0] === 'Це поле повинне бути унікальним.'
                ) {
                  Alert.alert(
                    t('Error'),
                    'Користувач з таким номером телефону вже зареєстрований в системі.',
                    [],
                    {cancelable: true},
                  );
                } else {
                  Alert.alert(t('Error'), t(error.message.phone[0]), [], {
                    cancelable: true,
                  });
                }
              }
            }
          });
      } else {
        Alert.alert(t('Error'), t('Passwords are not equal'), [], {
          cancelable: true,
        });
      }
    }
  };

  render() {
    const {isLoading, values} = this.state;

    if (isLoading) {
      return <Loader />;
    } else {
      return (
        <View style={theme.container}>
          <ScrollView
            style={{padding: 15}}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled">
            <HocIOS>
              <View>
                <Text style={theme.heading}>{t('Create seller')}</Text>
                <Form
                  ref="form"
                  type={Seller}
                  options={options}
                  value={values}
                />
                <TouchableOpacity
                  style={theme.simpleButton}
                  onPress={this.postData}>
                  <Text style={theme.simpleButtonText}>
                    {t('Create seller').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            </HocIOS>
          </ScrollView>
        </View>
      );
    }
  }
}
