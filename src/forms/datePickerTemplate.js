import React from 'react';
import {View, Text} from 'react-native';

import TextInputMask from 'react-native-text-input-mask';
import {t} from '../services/i18n';
import theme from '../styles';

export default function datePickerTemplate(locals) {
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
          let date = formatted;
          locals.onChange(date);
        }}
        mask={'[00]-[00]-[0000]'}
        ref="date"
        style={
          locals.editable ? theme.inputDateText : theme.inputDateTextDisabled
        }
        editable={locals.editable}
        keyboardType="phone-pad"
        placeholder="DD-MM-YYYY"
        value={locals.value}
        underlineColorAndroid="transparent"
      />
    </View>
  );
}
