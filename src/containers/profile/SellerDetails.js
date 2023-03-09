import React, {Component} from 'react';
import {Text, ScrollView, TouchableOpacity, View} from 'react-native';

import datePickerTemplate from '../../forms/datePickerTemplate';
import Loader from '../../components/Loader';
import {API, fetchDetails, fetchList, updateObject} from '../../services';
import form from 'tcomb-form-native';
import {t} from '../../services/i18n';
import theme from '../../styles';

import LocationsFactory from '../../forms/LocationsFactory';
import {HocIOS} from '../../HOC/hocIOS';

const Form = form.form.Form;

const Location = form.struct({
  id: form.Number,
  name: form.String,
  checked: form.Boolean,
});

const Seller = form.struct({
  first_name: form.maybe(form.String),
  last_name: form.maybe(form.String),
  locations: form.list(Location),
  date_birth: form.maybe(form.String),
});

let options = {
  fields: {
    first_name: {
      label: t('First name'),
    },
    last_name: {
      label: t('Last name'),
    },
    locations: {
      label: t('City'),
      factory: LocationsFactory,
    },
    date_birth: {
      label: t('Date of birth'),
      template: datePickerTemplate,
    },
  },
};

export default class SellerDetails extends Component {
  constructor(props) {
    super();

    this.state = {
      idSeller: props.navigation.state.params.id,
      values: {
        first_name: '',
        last_name: '',
        date_birth: '',
        locations: [],
      },
      isLoading: true,
      errors: {},
    };

    this.locations = [];
  }

  saveSeller = () => {
    let user = this.refs.form.getValue();

    if (user) {
      //FIXME: server format 'YYYY-MM-DD', app format 'DD-MM-YYYY', back-end busy
      let correctFormatDate = '';
      if (user.date_birth && user.date_birth !== '') {
        let dateArray = user.date_birth.split('-');
        correctFormatDate =
          dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
      }

      let data = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        city: user.locations[0].id,
        date_birth: correctFormatDate || null,
      };

      this.setState({
        values: user,
      });

      updateObject(API.supervisor.sellers, data, this.state.idSeller)
        .then(() => {
          this.props.navigation.navigate('SellersList');
        })
        .catch(error => {
          if (error.message.hasOwnProperty('date_birth')) {
            if (error.message.hasOwnProperty('date_birth')) {
              error.message.date_birth = ['Невірний формат дати'];
            }
            this.setState(({values}) => ({
              errors: error.message,
              values: {...values, date_birth: ''},
            }));
          }

          for (let key in error.message) {
            alert(`${t(key)}: ${error.message[key]}`);
          }
        });
    }
  };

  componentDidMount() {
    fetchList(API.supervisor.locations)
      .then(locations => {
        this.locations = locations;
        return fetchDetails(API.supervisor.sellers, this.state.idSeller);
      })
      .then(sellerData => {
        this.locations.forEach(location => {
          location.checked = location.id === sellerData.city;
        });

        sellerData.locations = this.locations;

        //FIXME: server format 'YYYY-MM-DD', app format 'DD-MM-YYYY', back-end busy
        let correctFormatDate = '',
          editableDate = true;
        if (sellerData.date_birth !== null) {
          editableDate = false;
          let dateArray = sellerData.date_birth.split('-');
          correctFormatDate =
            dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
        }
        sellerData.date_birth = correctFormatDate;
        options.fields.date_birth.editable = editableDate;

        this.setState({
          values: sellerData,
          isLoading: false,
        });
      });
  }

  render() {
    const {isLoading, values, errors} = this.state;

    options.fields.date_birth.hasError = !!errors.date_birth;

    let options_ = {
      fields: {
        first_name: {
          label: t('First name'),
        },
        last_name: {
          label: t('Last name'),
        },
        locations: {
          label: t('City'),
          factory: LocationsFactory,
        },
        date_birth: {
          editable: !values.date_birth,
          label: t('Date of birth'),
          template: datePickerTemplate,
          hasError: !!errors.date_birth,
        },
      },
    };

    if (isLoading) {
      return <Loader />;
    } else {
      return (
        <ScrollView
          style={[theme.container, {padding: 15}]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled">
          <HocIOS>
            <View>
              <Form ref="form" type={Seller} options={options} value={values} />

              <TouchableOpacity
                onPress={this.saveSeller}
                style={theme.simpleButton}>
                <Text style={theme.simpleButtonText}>
                  {t('Save').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </HocIOS>
        </ScrollView>
      );
    }
  }
}
