import React, {Component} from 'react';
import {
  View,
  Text,
  Slider,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from 'react-native';

import Loader from '../../components/Loader';
import {HocIOS} from '../../HOC/hocIOS';

import {API, createObject, updateObject} from '../../services';
import {t} from '../../services/i18n';

import theme from '../../styles';
import Bottle from '../../images/Bottle_template_50.png';

const Base64Bottle =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABWCAYAAACNWsX9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAw9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NENFMDdCOTU2NTlBMTFFOUI3MzlEMDE1NDdBNDg2QjciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NENFMDdCOTQ2NTlBMTFFOUI3MzlEMDE1NDdBNDg2QjciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iNjNEQjczOEFDQTE2NzA2NkE0REQyMzUzMUU2MUYyRjEiIHN0UmVmOmRvY3VtZW50SUQ9IjYzREI3MzhBQ0ExNjcwNjZBNEREMjM1MzFFNjFGMkYxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+vlr0sQAABd9JREFUeNrsXNsvXF0U38Zg3OpW17qLSEQiLuFF0fYLSb+GuMXlQfskkQhtwpv2wZN48eB7IRF/gMSLrwkRTS/0qa2KoB+JGaWUuNd1mNlda8Wc0BrmHGfoJ3slJ/sMc/bev7XW/q21J2sfxi8pHz584FVVVTwiIoJrNBrOGLPpcnBw4EFBQbysrIwPDAxcdhqcKX3QaDTy+vp6rtPpbJ68tQsVUFFRwVdXVxUDcSA0MuXo6IiVlpaynp4e+hwQEMAePHjAwsPDGUyK2dIlWIQtLy+zwcFBZjAY6G+pqamsr6+P+fn5MdmiBP2LFy8kbT558oSvrKwo1uTe3h5vbGyU+kNXuxLXmp2d5T4+PjRoeXk5V0ueP38ugXn79q39gbS3t9Ngrq6u/MuXL6oB2dzc5FFRUdT306dPZT+vkeuKHz9+pDYxMZHFxcUxteTWrVssIyOD7kdGRmQ/LxsIMIu0wNWWkJAQajc2NuwPxGw2U6vValUH4ujoKI0hl0xlA0HaRDGZTKoDsSgJx7CMYzcgvr6+1H7//l11IN++faPWy8vL/q6VlpZG7efPn9nY2JhqINbX19mbN2/oPjk52f4BcX5+nt++fZtoMi8vj4M7qEK/DQ0NUhwZGhq6mlyrublZGrSgoICDSygGsLu7y+vq6qT+Hj9+fLVJY2VlpTQ4BjKlaUpNTY3UT05ODt/a2lLUj0apT3d0dLD8/Hy6x6RvcXFRUT8LCwvUOjs7M8izKOlUJHJQb29v85cvX5IWIbJzDw8PSZuvX79WpMmSkpJTKT2wIlkb+5Oz/mwCAikDr62t5aGhob/tJXDgoqIiDtFYEZCpqSleXV3NgQ0pfzvZd2ZmJu/t7eWwbbjcfgSSQvbs2TMGO7gzAyAGLaTjhIQECmaHh4e/ucbJ7k8GuWMlMpg8c3FxobQE6Xdubu63cZKSklhrayvLysqS71qTk5O0Fb3s7k+tC9YQ7+/vt2oRqwlTW1sbRW93d3eWkpJCeZDc/OfXNEPBZpQsPDo6SslqS0sLA2aTZ5H79++TJh49esSvW/C3AQvN445SlkXOynJRoxDAGMQMshZqCdsfP36wpaUltra2Ruvk4OCAvgcsd2ptOTk5MTc3N7IyXrgHCQwMpPs7d+7Qvb+/P+3ZPT09JYvicxdlxRfm4hgjmpqaKLfS6/X0gwFOeH9/n9lDMJ5gYop7k8jISFronz59OtNVT7mxNda6d+8eAy4/d1Cw1hEMbATt7ULGuq7T6Uwwga+oPMvAFoviLy8nhtJAIAwHZTgajUYdWNgPrKgFazqfNx4Cm5iYIKaTbRGYiBkmtxAdHa2PjY39LyIiYg46NISFhX0FzW3AtQId74GbbMDChLk7HNkYiLUY8BAIUK837Nm9wT0DICkNhSwheHx8PGFmZiZydnY2Cj4Hwfe0iiJ7dnY2LbDc3Nz+43jDruuCTOIfnAsokJJMRbkWavuYy69NwHW3LqJvDbsh8r8Cch5rCYsIIALIDQJyY+hXsJYAIoAI1hIWEfQrLCKACCCCfgX9CosIIAKIYC3BWsIiAogAIuhXWETQrwAigAj6FRYR9CssIoAI1hIWsTNrWR4ym83XDtZkMmktc7IGxmqdYHBwMLWvXr36Ky8v718XF5e9qwaFB5Oxyu/du3eZ+BnLaHU6nTwg8fHx1G5vb7v29vb+/Se41nnnHq2Wy2KdL5aSY9EwFhc/fPiQ7ezsnMkgvxbvW/NpW545+T8PDw82NDREJbIo3d3drLi42CqlWRV4iCpNvby8+Pv376+8lNxgMPCYmBiaAyiVHxwcKDs/Mj09zWGtUEfu7u50tmptbc3uALAktquriwcGBtLYsD45rNXLnWcfHh5mJSUl0tEjXHB4Ttfb21vR6YOL6BXdd3x8nM3Pz9PfsJa+s7OTji1dFC0vFL1ezwsLC2W9CkGN6+7du/QqBtXfMIAHKPENAJOTk3RiQe1jrmgRLPCHdUHnRNLT020+PKboVQl/ovwUYABDQ+rhc8mu2gAAAABJRU5ErkJggg==';

export class BeCraftRecipeStage2 extends Component {
  state = {
    isLoading: true,
    data: [],
    amountML: null,
    name: '',
    recipeIdForUpdate: null,
    errors: {},
  };

  componentDidMount() {
    const {navigation} = this.props;

    let propsData = navigation.getParam('pickedIngredients'),
      recipeIdForUpdate = navigation.getParam('recipeIdForUpdate'),
      recipeNameForUpdate = navigation.getParam('recipeNameForUpdate');

    propsData.map(item => {
      item.value = 1;
      item.valueForRange = 0.01;

      if (item.defValue) {
        item.value = item.defValue;
        item.valueForRange = item.defValue / 100;
      }
    });

    propsData.sort((first_item, second_item) => {
      return first_item.level - second_item.level;
    });

    this.setState(
      {
        data: propsData,
        isLoading: false,
        recipeIdForUpdate: recipeIdForUpdate,
        name: recipeNameForUpdate || '',
      },
      () => this._amountML(),
    );
  }

  __convertTo = value => {
    return Math.round(value * 100);
  };

  _onChangeValue = (id, value) => {
    this.setState(
      ({data}) => ({
        data: data.map(item =>
          item.id === id
            ? {...item, value: this.__convertTo(value), valueForRange: value}
            : {...item},
        ),
      }),
      () => this._amountML(),
    );
  };

  _onChangeMinusValue = id => {
    this.setState(
      ({data}) => ({
        data: data.map(item =>
          item.id === id
            ? {
                ...item,
                value: item.value - 1 < 1 ? item.value : item.value - 1,
                valueForRange:
                  item.valueForRange - 0.01 < 0.01
                    ? item.valueForRange
                    : item.valueForRange - 0.01,
              }
            : {
                ...item,
              },
        ),
      }),
      () => this._amountML(),
    );
  };

  _onChangePlusValue = id => {
    this.setState(
      ({data}) => ({
        data: data.map(item =>
          item.id === id
            ? {
                ...item,
                value: item.value + 1 > 100 ? item.value : item.value + 1,
                valueForRange:
                  item.valueForRange + 0.01 > 1
                    ? item.valueForRange
                    : item.valueForRange + 0.01,
              }
            : {
                ...item,
              },
        ),
      }),
      () => this._amountML(),
    );
  };

  _amountML = () => {
    const {data} = this.state;
    let amount = 0;

    data.map(item => {
      amount += item.value;
    });

    this.setState({
      amountML: amount,
    });
  };

  _onChangeNameOfRecipe = text => {
    let error = {};
    if (text.length >= 50) {
      error = {
        name: [t('No more than 50 characters')],
      };
    } else {
      error = {};
    }
    this.setState({
      name: text,
      errors: error,
    });
  };

  _saveRecipe = () => {
    let {data, name, recipeIdForUpdate, errors} = this.state;

    data.map(item => {
      item.ingredient = item.id;
      item.amount = item.value;
    });

    if (errors.hasOwnProperty('name')) {
      Alert.alert(
        t('Message'),
        t('Invalid data, repeat again'),
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    } else {
      if (recipeIdForUpdate) {
        updateObject(
          API.recipes,
          {name: name, components: data},
          recipeIdForUpdate,
        )
          .then(() => {
            this.props.navigation.navigate('BeCraft');
          })
          .catch(error => {
            console.warn('error', error);
            this.setState({
              errors: error.message,
            });
          });
      } else {
        createObject(API.recipes, {name: name, components: data})
          .then(() => {
            this.props.navigation.navigate('BeCraft');
          })
          .catch(error => {
            console.warn('error', error);
            this.setState({
              errors: error.message,
            });
          });
      }
    }
  };

  _redirectToSale = () => {
    let {data} = this.state;

    data.map(item => {
      item.ingredient = item.id;
      item.amount = item.value;
    });

    this.props.navigation.navigate('Identification', {dataRecipeForSale: data});
  };

  render() {
    const {isLoading, data, amountML, name, errors} = this.state;

    const list = data.map((item, index) => (
      <IngredientRangeItem
        key={`ingr_range_${index}`}
        value={name}
        data={item}
        _onChangeValue={this._onChangeValue}
        _onMinusValue={this._onChangeMinusValue}
        _onPlusValue={this._onChangePlusValue}
      />
    ));

    if (isLoading) {
      return <Loader />;
    }

    return (
      <ScrollView
        style={{flex: 1, backgroundColor: '#fff', padding: 10}}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <HocIOS>
          {list}
          <View style={styles.blockContent}>
            <View
              style={{width: '60%', paddingBottom: 7, position: 'relative'}}>
              <Text
                style={[
                  styles.label,
                  errors.hasOwnProperty('name') ? {color: '#ff0000'} : {},
                ]}>
                {t('Aroma name')}
              </Text>
              <TextInput
                style={[
                  theme.textInput,
                  errors.hasOwnProperty('name') ? {borderColor: '#ff0000'} : {},
                ]}
                value={name}
                maxLength={50}
                underlineColorAndroid="transparent"
                onChangeText={this._onChangeNameOfRecipe}
              />
              {errors.hasOwnProperty('name') ? (
                <Text
                  style={{
                    color: '#ff0000',
                    fontSize: 12,
                    bottom: 0,
                    position: 'absolute',
                  }}>
                  {errors.name[0]}
                </Text>
              ) : null}
            </View>
            <BottleForRecipe amountML={amountML} />
          </View>
          <View
            style={[
              styles.ingredientRangeItemContainer,
              {
                paddingTop: 15,
                paddingBottom: 25,
                justifyContent: 'space-between',
              },
            ]}>
            <TouchableOpacity
              onPress={this._saveRecipe}
              style={styles.saveButton}>
              <Text
                style={[
                  theme.simpleButtonText,
                  {fontSize: 18, textAlign: 'center'},
                ]}>
                {t('Save perfume')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this._redirectToSale}
              style={[styles.saveButton, {backgroundColor: '#000'}]}>
              <Text
                style={[
                  theme.simpleButtonText,
                  {fontSize: 18, textAlign: 'center'},
                ]}>
                {t('Checkout for Sale')}
              </Text>
            </TouchableOpacity>
          </View>
        </HocIOS>
      </ScrollView>
    );
  }
}

class IngredientRangeItem extends Component {
  _onEventMinus = () => {
    const {data, _onMinusValue} = this.props;

    _onMinusValue(data.id);
  };

  _onEventPlus = () => {
    const {data, _onPlusValue} = this.props;

    _onPlusValue(data.id);
  };

  render() {
    const {data, _onChangeValue} = this.props;

    return (
      <View style={styles.ingredientRangeItemWrapper}>
        <View style={styles.ingredientRangeItemContainer}>
          <Image
            source={{uri: data.img}}
            style={styles.ingredientRangeItemImage}
          />
          <Text style={[styles.defText]}>{data.name}</Text>
        </View>
        <View style={[styles.ingredientRangeItemContainer, {marginBottom: 10}]}>
          <Text style={[styles.defText]}>{data.value} мл</Text>
        </View>
        <View
          style={[
            styles.ingredientRangeItemContainer,
            {justifyContent: 'space-between'},
          ]}>
          <TouchableOpacity
            style={styles.controllerButton}
            onPress={this._onEventMinus}>
            <Text
              style={[
                styles.controllerText,
                {left: Platform.OS === 'ios' ? 11 : 12},
              ]}>
              -
            </Text>
          </TouchableOpacity>
          <Slider
            style={{width: '80%', height: 40}}
            minimumValue={0.01}
            maximumValue={1}
            thumbTintColor={'#ff0000'}
            value={data.valueForRange}
            // onValueChange={(value) => _onChangeValue(data.id, value)}
            onSlidingComplete={value => _onChangeValue(data.id, value)}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
          />
          <TouchableOpacity
            style={styles.controllerButton}
            onPress={this._onEventPlus}>
            <Text style={[styles.controllerText]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class BottleForRecipe extends Component {
  checkSizeBottle = () => {
    const {amountML} = this.props;

    let result = {text: '', value: null};

    if (amountML <= 30) {
      result = {text: '30 мл', percent: amountML / 30};
    } else if (amountML > 30 && amountML <= 50) {
      result = {text: '50 мл', percent: amountML / 50};
    } else if (amountML > 50 && amountML <= 100) {
      result = {text: '100 мл', percent: amountML / 100};
    } else {
      result = {text: '> 100 мл', percent: 1};
    }

    return result;
  };

  render() {
    const {amountML} = this.props;
    let heightBottle = Platform.OS === 'ios' ? 55 : 61;
    let styleForAndroidBottle = {};
    if (Platform.OS !== 'ios') {
      styleForAndroidBottle = {height: 86, width: 50};
    }
    return (
      <View style={styles.bottleWrapper}>
        <View style={styles.bottleContainer}>
          <Image
            source={Platform.OS === 'ios' ? Bottle : {uri: Base64Bottle}}
            style={[{position: 'absolute', zIndex: 1}, styleForAndroidBottle]}
          />
          <View style={{backgroundColor: '#fff', height: 23}} />
          {/*55 max height(full for ios) && 61 max height(full for android)*/}
          <View
            style={{
              backgroundColor: '#c09760',
              height: heightBottle * this.checkSizeBottle().percent,
            }}
          />
        </View>
        <Text style={[styles.bottleWrapperText, styles.defText]}>
          {amountML} мл
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ingredientRangeItemWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 7,
    padding: 10,
    marginBottom: 10,
  },
  ingredientRangeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defText: {
    color: '#000',
  },
  ingredientRangeItemImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 40 / 2,
  },
  controllerButton: {
    width: 31,
    height: 31,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c09760',
    position: 'relative',
  },
  controllerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    top: 1,
    left: Platform.OS === 'ios' ? 9 : 10,
  },
  bottleContainer: {
    backgroundColor: '#fff',
    width: 50,
    height: Platform.OS === 'ios' ? 78 : 85,
    justifyContent: 'space-between',
    position: 'relative',
  },
  bottleWrapper: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottleWrapperText: {
    marginTop: 15,
  },
  blockContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  label: {
    marginBottom: 7,
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#c09760',
    borderRadius: 7,
    padding: 8,
    alignItems: 'center',
    width: '45%',
  },
});
