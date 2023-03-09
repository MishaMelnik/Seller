import React, {Component} from 'react';
import {
  Alert,
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {t} from '../services/i18n';
import theme from '../styles';

import {updateObjectWithResponse, API, login, createObject} from '../services';

export default class RestorePassword extends Component {
  state = {
    phone: '',
    password: '',
    confirm_password: '',
  };

  componentDidMount() {
    console.log('RestorePassword');
    const {phone} = this.props.navigation.state.params;
    this.setState({
      phone: phone,
    });
  }

  isValid() {
    return (
      this.state.password === this.state.confirm_password &&
      this.state.password.length >= 4
    );
  }

  showErrors(error) {
    if (error.hasOwnProperty('non_field_errors')) {
      Alert.alert(t('Error'), error.non_field_errors[0]);
    }
  }

  handleChangePassword = text => {
    this.setState({
      password: text,
    });
  };

  handleChangeConfirmPassword = text => {
    this.setState({
      confirm_password: text,
    });
  };

  postData = () => {
    const {phone, password} = this.state;

    const {tokenFCM} = this.props.navigation.state.params;

    let accessibility = false;

    if (this.isValid()) {
      updateObjectWithResponse(API.forgotPassword.restorePassword, {
        password: password,
        phone: phone,
      })
        .then(response => {
          const {user_type} = response.user;
          if (user_type === 1 || user_type === 2) {
            login(response.token, response.user);
            accessibility = true;
          }
        })
        .then(() => {
          if (accessibility === true) {
            createObject(API.token_phone, {reg_id: tokenFCM});
            this.props.navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
          } else {
            let error = {
              non_field_errors: [
                t('Unable to log in with the provided credentials.'),
              ],
            };
            this.showErrors(error);
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    } else {
      this.showErrors({
        non_field_errors: [t('Passwords are not equal')],
      });
    }
  };

  render() {
    return (
      <View style={{flex: 1, width: '100%', padding: 15}}>
        <ScrollView
          contentContainerStyle={styles.rememberContainer}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>{t('Change password')}</Text>
          <View>
            <Text>{t('New password')}</Text>
            <TextInput
              ref="password"
              keyboardType="default"
              placeholder={t('Password')}
              secureTextEntry={true}
              style={styles.textInput}
              onChangeText={this.handleChangePassword}
              underlineColorAndroid="transparent"
            />
          </View>
          <View>
            <Text>{t('Confirm password')}</Text>
            <TextInput
              ref="password"
              keyboardType="default"
              placeholder={t('Password')}
              secureTextEntry={true}
              style={styles.textInput}
              onChangeText={this.handleChangeConfirmPassword}
              underlineColorAndroid="transparent"
            />
          </View>
          <TouchableOpacity onPress={this.postData} style={theme.simpleButton}>
            <Text style={theme.simpleButtonText}>
              {t('Change password').toUpperCase()}
            </Text>
          </TouchableOpacity>
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
