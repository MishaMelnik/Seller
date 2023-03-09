import React, {Component} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

class Loader extends Component {
  render() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e31e24" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default Loader;
