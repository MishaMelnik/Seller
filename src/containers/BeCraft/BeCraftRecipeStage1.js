import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import Loader from '../../components/Loader';

import {API, fetchList} from '../../services';
import {t} from '../../services/i18n';

import logo from '../../images/logo.png';

const WIDTH = Dimensions.get('window').width;

export class BeCraftRecipeStage1 extends Component {
  state = {
    isLoading: true,
    ingredients: [],
    pickedIngredients: [],
  };

  componentDidMount() {
    fetchList(API.ingredients)
      .then(response => {
        let set = new Set(),
          results = [];

        if (
          this.props.navigation.state.params !== undefined &&
          this.props.navigation.state.params.hasOwnProperty('recipeForUpdate')
        ) {
          const {recipeForUpdate} = this.props.navigation.state.params;
          response.forEach(item => {
            item.picked = false;
            recipeForUpdate.components.map(i => {
              if (i.id === item.id) {
                item.picked = true;
                item.defValue = i.amount;
                item.component_id = i.component_id;
              }
            });

            if (item.picked) {
              let {pickedIngredients} = this.state;

              pickedIngredients.push(item);

              this.setState({
                pickedIngredients: pickedIngredients,
              });
            }
            set.add(item.level);
          });
        } else {
          response.forEach(item => {
            item.picked = false;
            set.add(item.level);
          });
        }

        set.forEach(setItem => {
          results.push({
            stepId: setItem,
            stepIngredients: response.filter(ingr => ingr.level === setItem),
            dropdownToggle: false,
          });
        });

        this.setState({
          isLoading: false,
          ingredients: results,
        });
      })
      .catch(error => console.warn('error', error));
  }

  _handlerStepToggle = id => {
    this.setState(({ingredients}) => ({
      ingredients: ingredients.map(item =>
        item.stepId === id
          ? {...item, dropdownToggle: !item.dropdownToggle}
          : {...item, dropdownToggle: false},
      ),
    }));
  };

  _handlerIngrToggle = (stepId, ingredient) => {
    this.setState(({ingredients, pickedIngredients}) => ({
      ingredients: ingredients.map(step =>
        step.stepId !== stepId
          ? {...step}
          : {
              ...step,
              stepIngredients: step.stepIngredients.map(ingr =>
                ingr.id !== ingredient.id
                  ? {...ingr, picked: false}
                  : {...ingr, picked: !ingr.picked},
              ),
            },
      ),
      pickedIngredients: this._addOrCutIngr(pickedIngredients, ingredient),
    }));
  };

  _addOrCutIngr = (pickedIngredients, ingredient) => {
    if (
      pickedIngredients.findIndex(item => item.level === ingredient.level) >= 0
    ) {
      if (pickedIngredients.findIndex(item => item.id === ingredient.id) >= 0) {
        return pickedIngredients.filter(item => item.id !== ingredient.id);
      } else {
        pickedIngredients = pickedIngredients.filter(
          item => item.level !== ingredient.level,
        );
        pickedIngredients.push(ingredient);

        return pickedIngredients;
      }
    } else {
      pickedIngredients.push(ingredient);

      return pickedIngredients;
    }
  };

  _statusPickedIngredient = stepId => {
    const {pickedIngredients} = this.state;

    return pickedIngredients.findIndex(item => item.level === stepId) >= 0;
  };

  _showPickedIngredient = stepId => {
    const {pickedIngredients} = this.state;

    return pickedIngredients.filter(item => item.level === stepId)[0];
  };

  _redirectToStage2 = () => {
    const {navigate} = this.props.navigation;
    const {pickedIngredients} = this.state;

    let propsBody = {pickedIngredients: pickedIngredients};

    if (pickedIngredients.length) {
      if (
        this.props.navigation.state.params !== undefined &&
        this.props.navigation.state.params.hasOwnProperty('recipeForUpdate')
      ) {
        propsBody.recipeIdForUpdate =
          this.props.navigation.state.params.recipeForUpdate.id;
        propsBody.recipeNameForUpdate =
          this.props.navigation.state.params.recipeForUpdate.name;
      }
      navigate('BeCraftRecipeStage2', propsBody);
    } else {
      Alert.alert(
        t('Message'),
        t('No ingredients selected'),
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    }
  };

  render() {
    const {ingredients, isLoading} = this.state;

    if (isLoading) {
      return <Loader />;
    }
    return (
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        <ListOfSteps
          steps={ingredients}
          _eventToggleStep={this._handlerStepToggle}
          _eventToggleIngr={this._handlerIngrToggle}
          _statusPickedIngredient={this._statusPickedIngredient}
          _showPickedIngredient={this._showPickedIngredient}
        />
        <View style={styles.redirectToContainer}>
          <TouchableOpacity
            style={styles.redirectToButton}
            onPress={this._redirectToStage2}>
            <Text style={styles.redirectToButtonText}>{t('Continue')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const ListOfSteps = props => {
  const {
    steps,
    _eventToggleStep,
    _eventToggleIngr,
    _statusPickedIngredient,
    _showPickedIngredient,
  } = props;

  const list = steps.map((item, index) => (
    <StepItem
      key={`step_index_${index}`}
      step={item}
      _eventToggleStep={_eventToggleStep}
      _eventToggleIngr={_eventToggleIngr}
      _statusPickedIngredient={_statusPickedIngredient}
      _showPickedIngredient={_showPickedIngredient}
    />
  ));

  return <View style={styles.container}>{list}</View>;
};

class StepItem extends Component {
  _event = () => {
    const {step, _eventToggleStep} = this.props;
    _eventToggleStep(step.stepId);
  };

  render() {
    const {
      step,
      _eventToggleIngr,
      _statusPickedIngredient,
      _showPickedIngredient,
    } = this.props;

    const stepInsideIngr = step.stepIngredients.map((ingr, index) => (
      <Ingredient
        stepId={step.stepId}
        ingr={ingr}
        _eventToggleIngr={_eventToggleIngr}
        key={`ingr_index_${index}`}
      />
    ));

    return (
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={[
            styles.stepsButton,
            step.dropdownToggle ? {backgroundColor: '#c09760'} : {},
          ]}
          onPress={this._event}>
          <PickedIngredientView
            eventShow={_statusPickedIngredient}
            step={step}
            _event={_showPickedIngredient}
          />
          <Icon
            name={`chevron-${step.dropdownToggle ? 'up' : 'down'}`}
            size={16}
            color={'#fff'}
          />
        </TouchableOpacity>
        <View
          style={
            step.dropdownToggle ? styles.dropdownContainer : styles.displayNone
          }>
          {stepInsideIngr}
        </View>
      </View>
    );
  }
}

class PickedIngredientView extends Component {
  render() {
    const {eventShow, _event, step} = this.props;

    if (!eventShow(step.stepId)) {
      return (
        <Text style={styles.stepsButtonText}>{t('Choose an ingredient')}</Text>
      );
    } else {
      let pickedIngredient = _event(step.stepId);

      return (
        <View style={styles.pickedIngr}>
          <Image
            source={
              pickedIngredient.img
                ? {uri: pickedIngredient.img}
                : Platform.OS === 'ios'
                ? logo
                : {uri: 'asset:/images/logo_android.png'}
            }
            style={styles.pickedIngrLogo}
          />
          <Text style={styles.stepsButtonText}>{pickedIngredient.name}</Text>
        </View>
      );
    }
  }
}

class Ingredient extends Component {
  _event = () => {
    const {stepId, ingr, _eventToggleIngr} = this.props;
    _eventToggleIngr(stepId, ingr);
  };

  render() {
    const {ingr} = this.props;
    return (
      <TouchableOpacity onPress={this._event}>
        <View style={styles.dropdownItem}>
          <Image
            style={
              ingr.picked
                ? [styles.dropdownItemImg, {borderColor: '#ff0000'}]
                : styles.dropdownItemImg
            }
            source={
              ingr.img
                ? {uri: ingr.img}
                : Platform.OS === 'ios'
                ? logo
                : {uri: 'asset:/images/logo_android.png'}
            }
          />
          <Text style={{color: '#000', textAlign: 'center'}}>{ingr.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  displayNone: {
    display: 'none',
  },
  stepsButton: {
    padding: 15,
    width: '100%',
    minHeight: 65,
    zIndex: 1,
    backgroundColor: '#977060',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 7,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  stepsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  dropdownWrapper: {
    marginBottom: 20,
  },
  dropdownContainer: {
    width: '100%',
    paddingTop: 10,
    paddingLeft: 7,
    borderTopWidth: 0,
    marginTop: -2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    width: (WIDTH - 20) * 0.3,
    backgroundColor: '#fff',
    margin: ((WIDTH - 20) * 0.1) / 12,
    alignItems: 'center',
    borderRadius: 7,
    padding: 5,
    justifyContent: 'space-between',
    minHeight: 60,
  },
  pickedIngr: {
    flexDirection: 'row',
    marginRight: 20,
    alignItems: 'center',
  },
  pickedIngrLogo: {
    marginRight: 10,
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
  },
  dropdownItemImg: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  redirectToContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  redirectToButton: {
    backgroundColor: '#c09760',
    borderRadius: 7,
    padding: 10,
    alignItems: 'center',
    width: '50%',
  },
  redirectToButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
