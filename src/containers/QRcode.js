import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
// import {RNCamera} from 'react-native-camera';

import {API, CheckCodeConsumer} from '../services';
import {t} from '../services/i18n';
import Loader from '../components/Loader';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
// import { Camera } from "react-native-vision-camera";

// function IsJsonString(str) {
//   try {
//     JSON.parse(str);
//   } catch (e) {
//     return false;
//   }
//   return true;
// }
const QRcode = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  // const devices = useCameraDevices();
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  console.log('devices', devices);

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  // Alternatively you can use the underlying function:
  //
  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
  //   runOnJS(setBarcodes)(detectedBarcodes);
  // }, []);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);
  // state = {
  //   loading: false,
  //   recipeIdForSale: null,
  //   phone: '',
  // };

  // const barcodeReceived = e => {
  //   const {navigate} = this.props.navigation;
  //   const {loading} = this.state;
  //   const {purchaseId, recipeIdForSale, dataRecipeForSale} =
  //     this.props.navigation.state.params;
  //
  //   let variantResult = {};
  //
  //   if (e.data !== '' && !loading) {
  //     if (IsJsonString(e.data)) {
  //       let qrCodeResponse = JSON.parse(e.data);
  //       if (qrCodeResponse.hasOwnProperty('phone')) {
  //         variantResult = {
  //           loading: true,
  //           phone: qrCodeResponse.phone,
  //           recipeIdForSale: null,
  //           dataRecipeForSale: null,
  //         };
  //
  //         if (qrCodeResponse.hasOwnProperty('recipeId')) {
  //           variantResult.recipeIdForSale = qrCodeResponse.recipeId;
  //         }
  //         if (recipeIdForSale) {
  //           variantResult.recipeIdForSale = recipeIdForSale;
  //         }
  //         if (dataRecipeForSale) {
  //           variantResult.dataRecipeForSale = dataRecipeForSale;
  //           variantResult.recipeIdForSale = null;
  //         }
  //         // if(qrCodeResponse.hasOwnProperty('recipeId')) {
  //         //   if(recipeIdForSale) {
  //         //     variantResult.recipeIdForSale = recipeIdForSale;
  //         //   } else {
  //         //     variantResult.recipeIdForSale = qrCodeResponse.recipeId;
  //         //   }
  //         // }
  //         this.setState(variantResult);
  //       } else {
  //         this.setState({
  //           loading: true,
  //         });
  //         Alert.alert('', t('Invalid data, repeat again'), [
  //           {
  //             text: 'OK',
  //             onPress: () => {
  //               this.setState({loading: false});
  //             },
  //           },
  //         ]);
  //       }
  //
  //       let code = {
  //         phone: qrCodeResponse.phone,
  //       };
  //
  //       CheckCodeConsumer(API.qr, code).then(response => {
  //         if (response.hasOwnProperty('success')) {
  //           this.setState({
  //             loading: true,
  //           });
  //           Alert.alert('', t('Invalid data, repeat again'), [
  //             {
  //               text: 'OK',
  //               onPress: () => {
  //                 this.setState({loading: false});
  //               },
  //             },
  //           ]);
  //         } else {
  //           response.purchaseId = purchaseId;
  //           response.statusForBonus = true;
  //           if (variantResult.recipeIdForSale) {
  //             response.recipeIdForSale = variantResult.recipeIdForSale;
  //           } else {
  //             response.dataRecipeForSale = variantResult.dataRecipeForSale;
  //           }
  //           if (purchaseId) {
  //             response.statusForBonus = false;
  //           }
  //
  //           navigate('SaleByShare', response);
  //           this.setState({loading: false});
  //         }
  //       });
  //     } else {
  //       this.setState({
  //         loading: true,
  //       });
  //       Alert.alert('', t('Invalid data, repeat again'), [
  //         {
  //           text: 'OK',
  //           onPress: () => {
  //             this.setState({loading: false});
  //           },
  //         },
  //       ]);
  //     }
  //   }
  // };

  // const handleBarcode = event => {
  //   this.barcodeReceived(event);
  // };

  // qrSquareTemplate() {
  //   return (
  //     // <View style={{width: 180, height: 130}}>
  //     //   <View
  //     //     style={{
  //     //       height: '100%',
  //     //       width: '100%',
  //     //       flexDirection: 'row',
  //     //       justifyContent: 'space-between',
  //     //     }}>
  //     //     <View
  //     //       style={{
  //     //         width: '25%',
  //     //         height: '25%',
  //     //         borderLeftWidth: 2,
  //     //         borderTopWidth: 2,
  //     //         borderColor: '#000',
  //     //       }}
  //     //     />
  //     //     <View
  //     //       style={{
  //     //         width: '25%',
  //     //         height: '25%',
  //     //         borderRightWidth: 2,
  //     //         borderTopWidth: 2,
  //     //         borderColor: '#000',
  //     //       }}
  //     //     />
  //     //   </View>
  //     //   <View
  //     //     style={{
  //     //       height: '100%',
  //     //       flexDirection: 'row',
  //     //       justifyContent: 'space-between',
  //     //     }}>
  //     //     <View
  //     //       style={{
  //     //         width: '25%',
  //     //         height: '25%',
  //     //         borderLeftWidth: 2,
  //     //         borderBottomWidth: 2,
  //     //         borderColor: '#000',
  //     //       }}
  //     //     />
  //     //     <View
  //     //       style={{
  //     //         width: '25%',
  //     //         height: '25%',
  //     //         borderRightWidth: 2,
  //     //         borderBottomWidth: 2,
  //     //         borderColor: '#000',
  //     //       }}
  //     //     />
  //     //   </View>
  //     // </View>
  //   );
  // }

  if (device == null) {
    return <Loader />;
  }
  console.log('device', device);

  return (
    <View style={styles.container}>
      {device != null && (
        <>
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
          {barcodes.map((barcode, idx) => (
            <Text key={idx} style={styles.barcodeTextURL}>
              {barcode.displayValue}
            </Text>
          ))}
        </>
      )}
      {/*<Camera device={} isActive={}/>*/}
      {/*<RNCamera*/}
      {/*  captureAudio={false}*/}
      {/*  ref={cam => {*/}
      {/*    this.camera = cam;*/}
      {/*  }}*/}
      {/*  style={styles.camera}*/}
      {/*  onBarCodeRead={this.handleBarcode}>*/}
      {/*  {this.qrSquareTemplate()}*/}
      {/*</RNCamera>*/}
    </View>
  );
};
export default QRcode;

// export default class QRcode extends Component {
//   state = {
//     loading: false,
//     recipeIdForSale: null,
//     phone: '',
//   };
//
//   barcodeReceived = e => {
//     const {navigate} = this.props.navigation;
//     const {loading} = this.state;
//     const {purchaseId, recipeIdForSale, dataRecipeForSale} =
//       this.props.navigation.state.params;
//
//     let variantResult = {};
//
//     if (e.data !== '' && !loading) {
//       if (IsJsonString(e.data)) {
//         let qrCodeResponse = JSON.parse(e.data);
//         if (qrCodeResponse.hasOwnProperty('phone')) {
//           variantResult = {
//             loading: true,
//             phone: qrCodeResponse.phone,
//             recipeIdForSale: null,
//             dataRecipeForSale: null,
//           };
//
//           if (qrCodeResponse.hasOwnProperty('recipeId')) {
//             variantResult.recipeIdForSale = qrCodeResponse.recipeId;
//           }
//           if (recipeIdForSale) {
//             variantResult.recipeIdForSale = recipeIdForSale;
//           }
//           if (dataRecipeForSale) {
//             variantResult.dataRecipeForSale = dataRecipeForSale;
//             variantResult.recipeIdForSale = null;
//           }
//           // if(qrCodeResponse.hasOwnProperty('recipeId')) {
//           //   if(recipeIdForSale) {
//           //     variantResult.recipeIdForSale = recipeIdForSale;
//           //   } else {
//           //     variantResult.recipeIdForSale = qrCodeResponse.recipeId;
//           //   }
//           // }
//           this.setState(variantResult);
//         } else {
//           this.setState({
//             loading: true,
//           });
//           Alert.alert('', t('Invalid data, repeat again'), [
//             {
//               text: 'OK',
//               onPress: () => {
//                 this.setState({loading: false});
//               },
//             },
//           ]);
//         }
//
//         let code = {
//           phone: qrCodeResponse.phone,
//         };
//
//         CheckCodeConsumer(API.qr, code).then(response => {
//           if (response.hasOwnProperty('success')) {
//             this.setState({
//               loading: true,
//             });
//             Alert.alert('', t('Invalid data, repeat again'), [
//               {
//                 text: 'OK',
//                 onPress: () => {
//                   this.setState({loading: false});
//                 },
//               },
//             ]);
//           } else {
//             response.purchaseId = purchaseId;
//             response.statusForBonus = true;
//             if (variantResult.recipeIdForSale) {
//               response.recipeIdForSale = variantResult.recipeIdForSale;
//             } else {
//               response.dataRecipeForSale = variantResult.dataRecipeForSale;
//             }
//             if (purchaseId) {
//               response.statusForBonus = false;
//             }
//
//             navigate('SaleByShare', response);
//             this.setState({loading: false});
//           }
//         });
//       } else {
//         this.setState({
//           loading: true,
//         });
//         Alert.alert('', t('Invalid data, repeat again'), [
//           {
//             text: 'OK',
//             onPress: () => {
//               this.setState({loading: false});
//             },
//           },
//         ]);
//       }
//     }
//   };
//
//   handleBarcode = event => {
//     this.barcodeReceived(event);
//   };
//
//   qrSquareTemplate() {
//     return (
//       <View style={{width: 180, height: 130}}>
//         <View
//           style={{
//             height: '100%',
//             width: '100%',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//           }}>
//           <View
//             style={{
//               width: '25%',
//               height: '25%',
//               borderLeftWidth: 2,
//               borderTopWidth: 2,
//               borderColor: '#000',
//             }}
//           />
//           <View
//             style={{
//               width: '25%',
//               height: '25%',
//               borderRightWidth: 2,
//               borderTopWidth: 2,
//               borderColor: '#000',
//             }}
//           />
//         </View>
//         <View
//           style={{
//             height: '100%',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//           }}>
//           <View
//             style={{
//               width: '25%',
//               height: '25%',
//               borderLeftWidth: 2,
//               borderBottomWidth: 2,
//               borderColor: '#000',
//             }}
//           />
//           <View
//             style={{
//               width: '25%',
//               height: '25%',
//               borderRightWidth: 2,
//               borderBottomWidth: 2,
//               borderColor: '#000',
//             }}
//           />
//         </View>
//       </View>
//     );
//   }
//
//   render() {
//     if (this.state.loading) {
//       return <Loader />;
//     }
//
//     return (
//       <View style={styles.container}>
//         {device != null && (
//           <>
//             <Camera
//               style={StyleSheet.absoluteFill}
//               device={device}
//               isActive={true}
//               frameProcessor={frameProcessor}
//               frameProcessorFps={5}
//             />
//             {barcodes.map((barcode, idx) => (
//               <Text key={idx} style={styles.barcodeTextURL}>
//                 {barcode.displayValue}
//               </Text>
//             ))}
//           </>
//         )}
//         {/*<Camera device={} isActive={}/>*/}
//         {/*<RNCamera*/}
//         {/*  captureAudio={false}*/}
//         {/*  ref={cam => {*/}
//         {/*    this.camera = cam;*/}
//         {/*  }}*/}
//         {/*  style={styles.camera}*/}
//         {/*  onBarCodeRead={this.handleBarcode}>*/}
//         {/*  {this.qrSquareTemplate()}*/}
//         {/*</RNCamera>*/}
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  camera: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
