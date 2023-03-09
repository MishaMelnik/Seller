import React, {Component} from 'react';
import {ScrollView, Dimensions} from 'react-native';

import RenderHtml from 'react-native-render-html';
import {API, fetchList} from '../services';

export default class LoyaltyTerms extends Component {
  state = {
    htmlContent: {html: ''},
    // loading: true
  };

  componentDidMount() {
    fetchList(API.loyalty)
      .then(res => {
        this.setState({htmlContent: {html: res.text}});
      })
      .catch(e => {});
  }

  render() {
    const {htmlContent} = this.state;
    return (
      <ScrollView style={{flex: 1, padding: 10}}>
        <RenderHtml
          source={htmlContent}
          imagesMaxWidth={Dimensions.get('window').width}
        />
      </ScrollView>
    );
  }
}
