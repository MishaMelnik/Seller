import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
} from 'react-native';
import form from 'tcomb-form-native';
import ImagePicker from 'react-native-image-picker';

import Loader from '../../components/Loader';
import {HocIOS} from '../../HOC/hocIOS';

import {
  API,
  fetchList,
  fetchDetails,
  updateObject,
  UnauthorizedError,
} from '../../services';

import {t} from '../../services/i18n';

import LocationsFactory from '../../forms/LocationsFactory';
import datePickerTemplate from '../../forms/datePickerTemplate';

import theme from '../../styles';

const Form = form.form.Form;

const Location = form.struct({
  id: form.Number,
  name: form.String,
  checked: form.Boolean,
});

const Campaign = form.struct({
  title: form.String,
  logo: form.maybe(form.String),
  date_start: form.String,
  date_end: form.String,
  description: form.String,
  locations: form.list(Location),
});

class CampaignEdit extends Component {
  constructor() {
    super();

    this.state = {
      values: {
        title: null,
        logo: null,
        date_start: null,
        date_end: null,
        locations: [],
        description: null,
      },
      descriptionHeight: 33,
      isLoading: true,
    };

    this.options = {
      fields: {
        title: {
          label: t('Title'),
        },
        logo: {
          label: t('Image'),
          template: this.imagePickerTemplate,
          onChange: this.selectLogo,
        },
        date_start: {
          label: t('Start date'),
          template: datePickerTemplate,
          editable: true,
        },
        date_end: {
          label: t('End date'),
          template: datePickerTemplate,
          editable: true,
        },
        locations: {
          label: t('City'),
          factory: LocationsFactory,
        },
        description: {
          label: t('Description'),
          multiline: true,
          /*
           TODO: integrate updating elements height
           https://github.com/gcanti/tcomb-form-native/issues/168/#issuecomment-222071556
           */
          // height: this.state.descriptionHeight,
          // onChange: (event) => {
          //   let contentHeight = event.nativeEvent.contentSize.height;
          //   if (contentHeight > this.state.descriptionHeight) {
          //     this.setState({descriptionHeight: contentHeight})
          //   }
          // }
        },
      },
    };
  }

  componentDidMount() {
    fetchDetails(
      API.supervisor.allcampaigns,
      this.props.navigation.state.params.id,
    )
      .then(response => {
        let date_start = response.date_start.split('-');
        let date_end = response.date_end.split('-');
        response.date_start =
          date_start[2] + '-' + date_start[1] + '-' + date_start[0];
        response.date_end = date_end[2] + '-' + date_end[1] + '-' + date_end[0];
        this.setState({values: response});
      })
      .then(() =>
        fetchList(API.supervisor.locations).then(locations => {
          locations.forEach(location => {
            this.state.values.location.forEach(picked => {
              if (location.id === picked) {
                location.checked = true;
              }
            });
          });
          let logoData;
          if (this.state.values.logo !== null) {
            this.state.values.logo = JSON.stringify(this.state.values.logo);
          }
          this.state.values.locations = locations;
          this.setState({isLoading: false});
        }),
      );
  }

  selectLogo = locals => {
    ImagePicker.showImagePicker({}, response => {
      if (!response.didCancel && !response.error) {
        let type;
        if (Platform.OS === 'ios') {
          type = 'image/jpeg';
        } else {
          type = response.type;
        }
        let img = {
          data: `data:${type};base64,${response.data}`,
          uri: response.uri,
        };

        locals.onChange(JSON.stringify(img));
      }
    });
  };

  imagePickerTemplate = locals => {
    const pickerInner = locals.value ? (
      <Image
        source={{uri: JSON.parse(locals.value).uri}}
        style={{
          flex: 1,
          alignSelf: 'stretch',
          width: null,
          height: 150,
          borderRadius: 4,
        }}
        resizeMode="cover"
      />
    ) : (
      <Text>{t('Choose logo...')}</Text>
    );

    return (
      <View>
        <Text style={locals.stylesheet.controlLabel.normal}>
          {locals.label}
        </Text>
        <TouchableOpacity
          style={{
            height: 150,
            backgroundColor: '#eee',
            borderWidth: 1,
            borderColor: '#ccc',
            marginBottom: 7,
            borderRadius: 4,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
          }}
          onPress={() => locals.onChangeNative(locals)}>
          {pickerInner}
        </TouchableOpacity>
      </View>
    );
  };

  postData = () => {
    let campaign = this.refs.form.getValue();

    if (campaign) {
      let date_start = campaign.date_start.split('-');
      let date_end = campaign.date_end.split('-');
      let data = {
        title: campaign.title,
        date_start: date_start[2] + '-' + date_start[1] + '-' + date_start[0],
        date_end: date_end[2] + '-' + date_end[1] + '-' + date_end[0],
        description: campaign.description,
        locations: campaign.locations.map(location => location.id),
        logo: campaign.logo ? JSON.parse(campaign.logo).data : null,
      };

      updateObject(
        API.supervisor.allcampaigns,
        data,
        this.props.navigation.state.params.id,
      ).then(response => {
        if (response === true) {
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        }
      });
    }
  };

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    } else {
      return (
        <View style={theme.container}>
          <ScrollView
            style={{padding: 15}}
            // keyboardDismissMode='interactive'
            keyboardShouldPersistTaps="handled">
            <HocIOS>
              <View>
                <Text style={theme.heading}>{t('Edit share')}</Text>
                <Form
                  ref="form"
                  type={Campaign}
                  options={this.options}
                  value={this.state.values}
                />
                <TouchableOpacity
                  style={theme.simpleButton}
                  onPress={this.postData}>
                  <Text style={theme.simpleButtonText}>
                    {t('Edit').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            </HocIOS>
          </ScrollView>
        </View>
      );
    }
  }
}

export default CampaignEdit;
