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
import TextInputMask from 'react-native-text-input-mask';
// import FCM from 'react-native-fcm';
import messaging from '@react-native-firebase/messaging';

import {authenticate, login, API, createObject} from '../services';
// import {PHONENUMBER_PREFIX} from '@app/config';
import {t} from '@app/services/i18n';
import theme from '@app/styles';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      password: '',
      token_id: '',
    };
  }

  componentDidMount() {
    messaging().requestPermission(); // for iOS
    messaging()
      .getToken()
      .then(token => {
        this.setState({token_id: token});
        // store fcm token in your server
      });
  }

  static navigationOptions = () => ({
    title: 'Perfums Bar',
  });

  isValid() {
    return !!this.state.phone && !!this.state.password;
  }

  showErrors(error) {
    if (error.hasOwnProperty('non_field_errors')) {
      Alert.alert(t('Error'), error.non_field_errors[0]);
    }
  }

  postData = () => {
    let accessibility = false,
      userType = 0;
    if (this.isValid()) {
      authenticate(this.state)
        .then(response => {
          const {user_type} = response.user;
          userType = user_type;
          if (user_type === 1 || user_type === 2) {
            login(response.token, response.user);
            accessibility = true;
          }
        })
        .then(() => {
          if (accessibility === true) {
            createObject(API.token_phone, {reg_id: this.state.token_id});
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
        .catch(this.showErrors);
    } else {
      let error = {non_field_errors: [t('Both fields are required')]};
      this.showErrors(error);
    }
  };

  handleChangeLogin = (formatted, extracted) => {
    this.setState({phone: `+38${extracted}`});
  };

  handleChangePassword = text => {
    this.setState({
      password: text,
    });
  };

  redirectToForgotPassword = () => {
    const {navigate} = this.props.navigation;
    const {token_id} = this.state;

    navigate('RememberPassword', {tokenFCM: token_id});
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          padding: 15,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <ScrollView
          contentContainerStyle={styles.loginContainer}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled">
          <TextInputMask
            onChangeText={this.handleChangeLogin}
            mask={'+38 ([000]) [000] [00] [00]'}
            ref="phone"
            style={styles.textInput}
            keyboardType="phone-pad"
            placeholder={t('Phone')}
            defaultValue="+38 ("
            underlineColorAndroid="transparent"
          />
          <TextInput
            ref="password"
            keyboardType="default"
            placeholder={t('Password')}
            secureTextEntry={true}
            style={styles.textInput}
            onChangeText={this.handleChangePassword}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity onPress={this.redirectToForgotPassword}>
            <Text style={styles.forgotPasswordBtn}>
              {t('Forgot password ?')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.postData()}
            style={theme.simpleButtons}>
            <Text style={theme.simpleButtonText}>
              {t('Sign in').toUpperCase()}
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
  loginContainer: {
    width: 220,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
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
  forgotPasswordBtn: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    color: '#000000',
  },
});
