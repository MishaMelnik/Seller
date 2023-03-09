import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';

import Loader from '../../components/Loader';

import {API, fetchList, createObject, UnauthorizedError} from '../../services';
import {t} from '../../services/i18n';
import form from 'tcomb-form-native';
import LocationsFactory from '../../forms/LocationsFactory';
import theme from '../../styles';

const Form = form.form.Form;

const Location = form.struct({
  id: form.Number,
  name: form.String,
  checked: form.Boolean,
});

const Campaign = form.struct({
  title: form.String,
  description: form.String,
  locations: form.list(Location),
});

export default class PushNotification extends Component {
  constructor() {
    super();

    this.state = {
      values: {
        title: null,
        locations: [],
        description: null,
      },
      descriptionHeight: 33,
      isLoading: true,
    };

    this.options = {
      fields: {
        title: {
          label: t('Title') + ' макс: 40 символів',
        },
        description: {
          label: t('Description') + ' макс: 156 символів',
          multiline: true,
          /*
           TODO: integrate updating elements height
           https://github.com/gcanti/tcomb-form-native/issues/168/#issuecomment-222071556
           */
          // height: this.state.descriptionHeight,
          // onChange: (event) => {
          //   let contentHeight = event.nativeEvent.contentSize.height;
          //   if (contentHeight > this.state.descriptionHeight) {
          //     this.setState({descriptionHeight: contentHeight})
          //   }
          // }
        },
        locations: {
          label: t('City'),
          factory: LocationsFactory,
        },
      },
    };

    // this.imagePickerTemplate.bind(this)
  }

  componentDidMount() {
    fetchList(API.supervisor.locations).then(locations => {
      locations.forEach(location => {
        location.checked = false;
      });

      this.setState({
        values: {
          title: null,
          description: null,
          locations: locations,
        },
        isLoading: false,
      });
    });
  }

  postData = () => {
    let campaign = this.refs.form.getValue();

    if (campaign) {
      let data = {
        title: campaign.title,
        body: campaign.description,
        locations: campaign.locations.map(location => location.id),
      };

      if (data.title.length > 40 || data.body.length > 156) {
        alert('Кількість символів більше допустимого:');
      } else {
        createObject(API.supervisor.notification, data)
          .then(() => {
            this.props.navigation.navigate('PushHistory');
            Keyboard.dismiss();
          })
          .catch(error => {
            if (error instanceof UnauthorizedError) {
              this.props.navigation.navigate('Login');
            } else {
              console.error(error.message || error);
            }
            Keyboard.dismiss();
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
          <KeyboardAvoidingView behavior="position">
            <ScrollView
              style={{padding: 15}}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled">
              <Text style={theme.heading}>{t('Push Notification')}</Text>
              <Form
                ref="form"
                type={Campaign}
                options={this.options}
                value={values}
              />
              <TouchableOpacity
                style={theme.simpleButton}
                onPress={this.postData}>
                <Text />
                <Text style={theme.simpleButtonText}>
                  {t('Publish').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}
