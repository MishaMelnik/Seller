import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export class HocIOS extends Component {
  render() {
    if (Platform.OS === 'ios') {
      return (
        <KeyboardAwareScrollView>{this.props.children}</KeyboardAwareScrollView>
      );
    } else {
      return <View>{this.props.children}</View>;
    }
  }
}
