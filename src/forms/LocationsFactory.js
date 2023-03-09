import React from 'react';
import {View, Text, Switch} from 'react-native';
import form from 'tcomb-form-native';
import theme from '../styles';

class LocationsFactory extends form.form.Component {
  getTemplate() {
    return locals => {
      const locations = locals.value.map((location, i) => (
        <View key={i} style={theme.switcher}>
          <Switch
            ref="input"
            value={location.checked}
            onValueChange={value => {
              console.log('location', location);
              let locations = locals.value.map(location => {
                return location;
              });
              locations[i].checked = value;
              locals.onChange(locations, locals.path);
            }}
          />
          <Text style={theme.switcherLabel}>{location.name}</Text>
        </View>
      ));
      const stylesheet = locals.stylesheet;
      let controlLabelStyle = stylesheet.controlLabel.normal;
      let helpBlockStyle = stylesheet.helpBlock.normal;
      let errorBlockStyle = stylesheet.errorBlock;

      if (locals.hasError) {
        controlLabelStyle = stylesheet.controlLabel.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

      const label = locals.label ? (
        <Text style={controlLabelStyle}>{locals.label}</Text>
      ) : null;
      const help = locals.help ? (
        <Text style={helpBlockStyle}>{locals.help}</Text>
      ) : null;
      const error =
        locals.hasError && locals.error ? (
          <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
            {locals.error}
          </Text>
        ) : null;

      return (
        <View>
          {label}
          {error}
          {locations}
          {help}
        </View>
      );
    };
  }

  validate() {
    let value = this.state.value.filter(item => item.checked);
    let errors = [];
    let hasError = !this.state.value.some(val => val.checked);

    if (hasError) {
      let error = {
        message: 'Location is required',
        path: this.props.ctx.path,
      };

      errors.push(error);
    }

    this.setState({hasError: hasError});
    return new form.ValidationResult({errors: errors, value: value});
  }
}

LocationsFactory.transformer = form.form.List.transformer;

export default LocationsFactory;
