import React, {Component} from 'react';
import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';

import {fetchDetails, API} from '../../services';
import {t} from '../../services/i18n';

const GETDETAIL = {
  1: API.catalog.perfume,
  2: API.catalog.accessor,
};

const GENDER = {
  1: t('Men`s'),
  2: t('Women`s'),
  3: 'Unisex',
};

const KIND = {
  1: t('Brand`s'),
  2: t('Niche'),
};

export class CatalogItemDetail extends Component {
  state = {
    data: '',
    product_type: '',
  };

  componentDidMount() {
    const {productId, product_type} = this.props.navigation.state.params;

    fetchDetails(GETDETAIL[product_type], productId)
      .then(response => {
        this.setState({
          data: response,
          product_type: product_type,
        });
      })
      .catch(error => console.warn('error', error));
  }

  render() {
    const {data} = this.state;

    return (
      <ScrollView style={styles.detailContainer}>
        {data.is_new ? (
          <View style={styles.catalogItemNew}>
            <Text style={styles.catalogItemTextNew}>NEW</Text>
          </View>
        ) : null}
        <View style={styles.containerRow}>
          <Image
            source={{uri: data.img}}
            style={styles.imageProduct}
            resizeMode="contain"
          />
        </View>
        <View style={styles.containerColumn}>
          <View style={styles.rowWithLabel}>
            <Text style={[styles.defText, styles.labelText]}>{t('Name')}:</Text>
            <Text style={[styles.defText, styles.valueFromDataText]}>
              {data.name}
            </Text>
          </View>
          <View style={styles.rowWithLabel}>
            <Text style={[styles.defText, styles.labelText]}>
              {t('Brand')}:
            </Text>
            <Text style={[styles.defText, styles.valueFromDataText]}>
              {data.brand}
            </Text>
          </View>
          {data.kind ? (
            <View style={styles.rowWithLabel}>
              <Text style={[styles.defText, styles.labelText]}>
                {t('View')}:
              </Text>
              <Text style={[styles.defText, styles.valueFromDataText]}>
                {KIND[data.kind]}
              </Text>
            </View>
          ) : null}
          {data.gender_choice ? (
            <View style={styles.rowWithLabel}>
              <Text style={[styles.defText, styles.labelText]}>
                {t('For who')}:
              </Text>
              <Text style={[styles.defText, styles.valueFromDataText]}>
                {GENDER[data.gender_choice]}
              </Text>
            </View>
          ) : null}
          {data.perfume_code ? (
            <View style={styles.rowWithLabel}>
              <Text style={[styles.defText, styles.labelText]}>
                {t('Code for sale')}:
              </Text>
              <Text style={[styles.defText, styles.valueFromDataText]}>
                #{data.perfume_code}
              </Text>
            </View>
          ) : null}
          <View style={styles.rowWithLabel}>
            <Text style={[styles.defText, styles.labelText]}>
              {t('Description')}:
            </Text>
            <Text style={[styles.defText, styles.valueFromDataText]}>
              {data.description}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  detailContainer: {
    backgroundColor: '#fff',
    // padding: 10,
    position: 'relative',
  },
  containerRow: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  containerColumn: {
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    // alignItems: 'center'
  },
  imageProduct: {
    width: 210,
    height: 210,
  },
  defText: {
    color: '#000',
  },
  nameOfProductText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowWithLabel: {
    marginBottom: 10,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  valueFromDataText: {
    fontSize: 18,
  },
  catalogItemNew: {
    position: 'absolute',
    justifyContent: 'center',
    right: -20,
    top: 10,
    width: 80,
    height: 20,
    zIndex: 5,
    backgroundColor: '#ff0000',
    transform: [{rotate: '45deg'}],
  },
  catalogItemTextNew: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
