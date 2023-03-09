import React from 'react';
import {View, Text} from 'react-native';
import TextInputMask from 'react-native-text-input-mask';

import {t} from '../services/i18n';
import theme from '../styles';

export default function phoneTemplate(locals) {
  const stylesheet = locals.stylesheet;
  let controlLabel =
    stylesheet.controlLabel[locals.hasError ? 'error' : 'normal'];

  return (
    <View>
      <Text style={controlLabel}>{locals.label}</Text>
      <TextInputMask
        refInput={ref => {
          this.input = ref;
        }}
        onChangeText={(formatted, extracted) => {
          let phone = `+38${extracted}`;
          locals.onChange(phone);
        }}
        mask={'+38 ([000]) [000] [00] [00]'}
        ref="phone"
        style={theme.textInput}
        keyboardType="phone-pad"
        placeholder=" "
        underlineColorAndroid="transparent"
      />
    </View>
  );
}
