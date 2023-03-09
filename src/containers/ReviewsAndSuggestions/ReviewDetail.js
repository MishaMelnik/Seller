import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {API, fetchDetails, createObject} from '../../services';
import Loader from '../../components/Loader';
import {t} from '../../services/i18n';

export default class ReviewDetail extends Component {
  state = {
    detail: '',
    isLoading: true,
    description: '',
  };

  componentDidMount() {
    const reviewState = this.props.navigation.state;
    fetchDetails(API.comments, reviewState.params.id).then(response => {
      this.setState({
        detail: response,
        isLoading: false,
      });
    });
  }

  postData = () => {
    const {description, detail} = this.state;
    if (this.state.description) {
      let requestData = {
        description: description,
        parent: detail.id,
      };
      createObject(API.comments, requestData).then(() => {
        const {navigate} = this.props.navigation;
        Keyboard.dismiss();
        Alert.alert(
          '',
          t('Thank for your answer'),
          [
            {
              text: 'OK',
              onPress: () => {
                navigate('RevAndSugList');
              },
            },
          ],
          {cancelable: false},
        );
      });
    } else {
      Alert.alert(t('Missing data'));
      Keyboard.dismiss();
    }
  };

  handleChangeText = text => {
    this.setState({
      description: text,
    });
  };

  render() {
    const {detail, isLoading} = this.state;
    const {feedback} = detail;

    this.props.navigation.state.params.backFunction();
    if (!isLoading) {
      return (
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>{detail.theme}</Text>
          <View>
            <View style={styles.comment}>
              <Text>
                {t('City')}: {detail.city}
              </Text>
              <Text style={styles.textReview}>
                {t('Author')}: {detail.author}
              </Text>
              <Text style={styles.textReview}>{detail.description}</Text>
            </View>
            {feedback !== null ? (
              <View style={styles.feedback}>
                <Text>
                  {' '}
                  {t('Author')}: {feedback.author !== '' ? feedback.author : ''}
                </Text>
                <Text style={styles.textReview}> {feedback.description}</Text>
              </View>
            ) : (
              <View style={{marginTop: 10}}>
                <Text style={styles.label}>
                  {t('Answer') + ' макс: 300 символів'}
                </Text>
                <TextInput
                  keyboardType="default"
                  style={styles.textarea}
                  multiline={true}
                  maxLength={300}
                  underlineColorAndroid="transparent"
                  onChangeText={this.handleChangeText}
                />
                <View style={{padding: 10}}>
                  <TouchableOpacity
                    onPress={this.postData}
                    style={styles.simpleButtons}>
                    <Text style={styles.simpleButtonText}>
                      {t('Send answer').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      );
    }

    return <Loader />;
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
  comment: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: '95%',
    borderRadius: 5,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  feedback: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: '95%',
    marginLeft: 15,
    borderRadius: 5,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textarea: {
    minHeight: 37,
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
  cityReview: {
    color: '#000',
  },
  textReview: {
    fontSize: 16,
    color: '#000000',
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
    fontSize: 18,
    color: '#fff',
  },
});
