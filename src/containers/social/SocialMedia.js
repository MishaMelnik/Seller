import React, {Component, useCallback} from 'react';

import {
  Alert,
  Button,
  Linking,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Communications from 'react-native-communications';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {API_URL} from '../../services';
import {API, fetchList} from '../../services';
import {t} from '../../services/i18n';

// import { HOTLINE_NUMBER, HOTLINE_NUMBER_for_CALL, EMAIL_HOTLINE } from "../../config";

export class SocialMedia extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      contacts: {},
    };
  }

  componentDidMount() {
    fetchList(API.socialmedia)
      .then(response => {
        this.setState({
          data: response,
        });
      })
      .catch(error => console.warn('error', error));

    fetchList(API.contacts)
      .then(response => {
        let _contacts = response;
        this.setState({
          contacts: {..._contacts},
        });
      })
      .catch(error => console.warn('error', error));
  }

  emailFunction = emailHot =>
    Communications.email([{emailHot}, ''], null, null, '', '');

  callFunction = phoneHot => Communications.phonecall(phoneHot, true);

  render() {
    const {data, contacts} = this.state;
    let emailHot = contacts.email;
    let phoneHot = contacts.phone;
    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'flex-end',
            width: '100%',
            alignItems: 'flex-end',
          }}>
          <View style={styles.contactsView}>
            <TouchableOpacity onPress={() => this.emailFunction(emailHot)}>
              <View style={styles.holder}>
                {contacts.email === '' ||
                contacts.email === undefined ? null : (
                  <Icon name="envelope" size={20} style={{marginTop: 5}} />
                )}

                <Text style={styles.callAdmin}>{contacts.email}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.callFunction(phoneHot)}>
              <View style={styles.holder}>
                {contacts.phone === '' ||
                contacts.phone === undefined ? null : (
                  <Icon name="phone" size={20} style={{marginTop: 5}} />
                )}

                <Text style={styles.callAdmin}>{contacts.phone}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{width: '100%'}}>
          <View style={styles.wrapper}>
            {data.map((item, index) => (
              <View key={index.toString()} style={styles.iconContainer}>
                <TouchableOpacity
                  style={styles.socialLink}
                  onPress={() =>
                    Linking.canOpenURL(item.link).then(supported => {
                      if (supported) {
                        return Linking.openURL(item.link);
                      } else {
                        return Linking.openURL(item.link);
                      }
                    })
                  }>
                  <Image
                    style={{width: 42, height: 42, padding: 2, borderRadius: 7}}
                    source={{uri: `${item.image}`}}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 110,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 2,
  },
  iconContainer: {
    width: 46,
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 5,
  },
  socialLink: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 6,
  },

  callAdmin: {
    marginBottom: 20,
    textAlign: 'left',
    fontSize: 18,
    marginLeft: 10,
  },
  holder: {
    marginLeft: 15,
    width: '110%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  contactsView: {
    marginTop: 10,
    marginLeft: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '85%',
  },

  iconText: {
    color: 'black',
    fontSize: 18,
    marginLeft: 5,
  },
});
