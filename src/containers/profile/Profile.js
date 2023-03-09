import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// import TextInputMask from 'react-native-text-input-mask';
import form from 'tcomb-form-native';

import {API, updateObject} from '../../services';
import {getUser, updateUser, USER_TYPES} from '../../services/auth';
import {t} from '../../services/i18n';
import theme from '../../styles';
import Loader from '../../components/Loader';
import datePickerTemplate from '../../forms/datePickerTemplate';
import {HocIOS} from '../../HOC/hocIOS';

const Form = form.form.Form;

const Email = form.refinement(form.String, email =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  ),
);

const changeSellerProfile = form.struct({
  phone: form.maybe(form.String),
  first_name: form.maybe(form.String),
  last_name: form.maybe(form.String),
  date_birth: form.maybe(form.String),
});

const seller_options = {
  fields: {
    phone: {
      label: t('Phone number'),
      editable: false,
    },
    first_name: {
      label: t('First name'),
    },
    last_name: {
      label: t('Last name'),
    },
    date_birth: {
      label: t('Date of birth'),
      template: datePickerTemplate,
    },
  },
};

const changeSupervisorProfile = form.struct({
  phone: form.maybe(form.String),
  first_name: form.maybe(form.String),
  last_name: form.maybe(form.String),
  email: form.maybe(Email),
});

const supervisor_options = {
  fields: {
    phone: {
      label: t('Phone number'),
      editable: false,
    },
    first_name: {
      label: t('First name'),
    },
    last_name: {
      label: t('Last name'),
    },
    email: {
      label: 'Email',
      error: 'Enter valid Email',
      autoCapitalize: 'none',
    },
  },
};

const form_settings = {
  1: {
    fields: changeSupervisorProfile,
    options: supervisor_options,
  },
  2: {
    fields: changeSellerProfile,
    options: seller_options,
  },
};

export default class Profile extends Component {
  state = {
    userType: null,
    shouldInitValues: true,
    dateChange: false,
    editableDate: false,
    userData: {},
  };

  componentDidMount() {
    getUser().then(user => {
      // FIXME: server format 'YYYY-MM-DD', app format 'DD-MM-YYYY', back-end busy
      let correctFormatDate = '';
      if (user.date_birth !== null && user.user_type === 2) {
        let dateArray = user.date_birth.split('-');
        correctFormatDate =
          dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
      }
      user.date_birth = correctFormatDate;

      this.setState({
        userType: user.user_type,
        userData: user,
      });

      if (
        this.state.userData.date_birth === null ||
        this.state.userData.date_birth === ''
      ) {
        this.setState({editableDate: true});
      }

      if (this.state.shouldInitValues) {
        this.setInitialValues();
      }
    });
  }

  setInitialValues = () => {
    // FIXME: add editable mode for input date birth
    if (this.state.userType === 2) {
      form_settings[this.state.userType].options.fields.date_birth.editable =
        this.state.editableDate;
    }

    let fields = form_settings[this.state.userType].options.fields;

    for (let field in fields) {
      fields[field].value = this.state[field] || '';
    }

    this.setState({shouldInitValues: false});
  };

  postData = () => {
    let update_url = {
      [USER_TYPES.supervisor]: API.supervisor.profile,
      [USER_TYPES.seller]: API.seller.profile,
    }[this.state.userType];

    const updated_data = this.refs.form.getValue();

    if (updated_data) {
      let user = this.state.userData;

      for (let key in updated_data) {
        user[key] = updated_data[key] || '';
      }

      //FIXME: server format 'YYYY-MM-DD', app format 'DD-MM-YYYY', back-end busy
      let correctFormatDate = '';
      if (user.date_birth !== null) {
        let dateArray = user.date_birth.split('-');
        correctFormatDate =
          dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
      }
      user.date_birth = correctFormatDate;

      updateObject(update_url, user)
        .then(() => updateUser(user))
        .then(() => {
          this.props.navigation.navigate('Home');
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    const {userType, shouldInitValues, userData} = this.state;

    if (userType && !shouldInitValues) {
      return (
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled">
          <HocIOS>
            <View>
              <Text style={styles.heading}>{t('Profile')}</Text>
              <Form
                ref="form"
                type={form_settings[userType].fields}
                options={form_settings[userType].options}
                value={userData}
              />
              <TouchableOpacity
                onPress={this.postData}
                style={theme.simpleButton}>
                <Text style={theme.simpleButtonText}>
                  {t('Update profile').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </HocIOS>
        </ScrollView>
      );
    } else {
      return <Loader />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  label: {
    color: '#000',
    fontSize: 17,
    marginBottom: 7,
    fontWeight: '500',
  },
  heading: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 30,
  },
});
