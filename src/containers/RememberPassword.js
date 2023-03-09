import React, {Component} from 'react';
import {
  Alert,
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

import TextInputMask from 'react-native-text-input-mask';

import {t} from '../services/i18n';
import theme from '../styles';

import {updateObject, API} from '../services';

class ViewInputContainer extends Component {
  _handleMaskInput = (formatted, extracted) => {
    const {handleMaskInput} = this.props;

    handleMaskInput(formatted, extracted);
  };

  render() {
    const {statusView, formatted_phone} = this.props;

    // if (statusView) {
    return (
      <View>
        <Text style={theme.colorTextDefault}>{t('Enter phone number')}</Text>
        <TextInputMask
          onChangeText={this._handleMaskInput}
          mask={'+38 ([000]) [000] [00] [00]'}
          style={styles.textInput}
          keyboardType="phone-pad"
          placeholder={t('Phone')}
          editable={statusView}
          defaultValue="+38 ("
          underlineColorAndroid="transparent"
        />
      </View>
    );
    // } else {
    //   return (
    //     <View>
    //       <Text>{t('Enter phone number')}</Text>
    //       <Text style={styles.fakeTextInput}>
    //         {formatted_phone}
    //       </Text>
    //     </View>
    //   )
    // }
  }
}

class ViewSMSContainer extends Component {
  _handleSMSInput = text => {
    const {handleSMSInput} = this.props;

    handleSMSInput(text);
  };

  render() {
    const {statusView} = this.props;

    if (statusView) {
      return (
        <View>
          <Text style={theme.colorTextDefault}>
            {t('Enter the code from the SMS message')}
          </Text>
          <TextInput
            keyboardType="default"
            placeholder={t('Password')}
            style={styles.textInput}
            onChangeText={this._handleSMSInput}
            underlineColorAndroid="transparent"
          />
        </View>
      );
    } else {
      return null;
    }
  }
}

const ViewButtonContainer = props => {
  const {statusView, postPhone, postData} = props;

  if (statusView) {
    return (
      <TouchableOpacity onPress={postPhone} style={theme.simpleButtons}>
        <Text style={theme.simpleButtonText}>{t('Get SMS').toUpperCase()}</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={postData} style={theme.simpleButtons}>
        <Text style={theme.simpleButtonText}>
          {t('Continue').toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
};

export default class RememberPassword extends Component {
  state = {
    phone: '',
    sms_code: '',
    formatted_phone: '',
    step1: true,
    step2: false,
  };

  showErrors(error) {
    if (error.hasOwnProperty('non_field_errors')) {
      Alert.alert(t('Error'), error.non_field_errors[0]);
    }
  }

  handleMaskInput = (formatted, extracted) => {
    this.setState({
      phone: `+38${extracted}`,
      formatted_phone: formatted,
    });
  };

  handleSMSInput = value => {
    this.setState({
      sms_code: value,
    });
  };

  postData = () => {
    const {phone, sms_code} = this.state;

    const {navigate} = this.props.navigation;
    const {tokenFCM} = this.props.navigation.state.params;

    if (sms_code.length === 4) {
      updateObject(API.forgotPassword.sendSMS, {
        phone: phone,
        activate_code: sms_code,
      })
        .then(response => {
          Keyboard.dismiss();
          navigate('RestorePassword', {phone: phone, tokenFCM: tokenFCM});
        })
        .catch(() => {
          let error = {non_field_errors: [t('Invalid data, repeat again')]};
          this.showErrors(error);
        });
    } else {
      let error = {non_field_errors: [t('Invalid data, repeat again')]};
      this.showErrors(error);
    }
  };

  postPhone = () => {
    const {phone} = this.state;

    if (phone.length === 13) {
      updateObject(API.forgotPassword.identification, {phone: phone})
        .then(response => {
          if (response) {
            this.setState({
              step1: false,
              step2: true,
            });
          }
        })
        .catch(errors => {
          let error = {non_field_errors: [errors.message.detail]};
          this.showErrors(error);
        });
    } else {
      let error = {non_field_errors: [t('Invalid phone number')]};
      this.showErrors(error);
    }
  };

  render() {
    const {formatted_phone, step1, step2} = this.state;

    return (
      <View style={{flex: 1, width: '100%', padding: 15}}>
        <ScrollView
          contentContainerStyle={styles.rememberContainer}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>{t('Password recovery')}</Text>
          <ViewInputContainer
            handleMaskInput={this.handleMaskInput}
            statusView={step1}
            formatted_phone={formatted_phone}
          />
          <ViewSMSContainer
            handleSMSInput={this.handleSMSInput}
            statusView={step2}
          />
          <ViewButtonContainer
            postPhone={this.postPhone}
            postData={this.postData}
            statusView={step1}
          />
        </ScrollView>
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
  rememberContainer: {
    width: 320,
    display: 'flex',
    flex: 1,
    // justifyContent: 'center',
    // alignContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textInput: {
    height: 37,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  fakeTextInput: {
    height: 37,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingTop: 9,
    marginBottom: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  forgotPasswordBtn: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    color: '#000000',
  },
  heading: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 30,
    color: '#000000',
  },
});
