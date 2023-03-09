import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {API, updateObject} from '../../services';
import {t} from '../../services/i18n';
import form from 'tcomb-form-native';
import theme from '../../styles';

const Form = form.form.Form;

let Password = form.refinement(form.String, v => v.length >= 4);

const changePassword = form.struct({
  old_password: Password,
  new_password: Password,
  confirm_password: Password,
});

const form_options = {
  fields: {
    auto: 'none',
    old_password: {
      label: t('Old password'),
      secureTextEntry: true,
      error: t('Min length of password is 4 chars'),
    },
    new_password: {
      label: t('New password'),
      secureTextEntry: true,
      error: t('Min length of password is 4 chars'),
    },
    confirm_password: {
      label: t('Confirm password'),
      secureTextEntry: true,
      error: t('Min length of password is 4 chars'),
    },
  },
  error: t('Passwords are not equal'),
};

export default class ChangePassword extends Component {
  isValid(form_data) {
    if (form_data) {
      if (form_data.new_password !== form_data.confirm_password) {
        this.refs.form.refs.input.setState({hasError: true});
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  postData = () => {
    // if validation fails, value will be null
    const form_data = this.refs.form.getValue();
    if (this.isValid(form_data)) {
      const data = {
        password: form_data.old_password,
        new_password: form_data.new_password,
      };

      updateObject(API.profile.password, data)
        .then(() => {
          this.props.navigation.navigate('Home');
        })
        .catch(error => {
          let form = this.refs.form.refs.input;
          if (error.message instanceof Object) {
            for (let field in error.message) {
              form_options.fields[field].error = error.message[field];
              form.refs[field].setState({hasError: true});
            }
          }
        });
    }
  };

  render() {
    return (
      <ScrollView
        style={styles.container}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always">
        <KeyboardAvoidingView behavior="position">
          <Text style={styles.heading}>{t('Change password')}</Text>
          <Form ref="form" type={changePassword} options={form_options} />

          <TouchableOpacity onPress={this.postData} style={theme.simpleButton}>
            <Text style={theme.simpleButtonText}>
              {t('Change password').toUpperCase()}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
});
