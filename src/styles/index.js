import {StyleSheet} from 'react-native';

export const PRIMARY_COLOR = '#000';
export const SECONDARY_COLOR = '#ffffff';
export const FONT_COLOR = '#333333';

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SECONDARY_COLOR,
  },
  heading: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    color: FONT_COLOR,
  },
  textInput: {
    height: 37,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 2,
  },
  inputDateText: {
    height: 37,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 2,
    fontSize: 16,
  },
  inputDateTextDisabled: {
    height: 37,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 2,
    backgroundColor: '#ededed',
    color: '#727171',
    fontSize: 16,
  },
  switcher: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switcherLabel: {
    marginLeft: 15,
    fontSize: 16,
  },
  simpleButton: {
    height: 40,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 30,
  },
  simpleButtons: {
    height: 40,
    backgroundColor: '#000',
    //#e31e24
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  simpleButtonDelete: {
    height: 37,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  simpleButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  colorTextDefault: {
    color: '#000000',
  },
  alertContainerRow: {
    width: '95%',
    flexDirection: 'row',
    marginTop: 10,
  },
  alertContainerBtn: {
    width: '50%',
    padding: 10,
    borderRadius: 7,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainerBtnText: {
    fontWeight: 'bold',
    color: '#000',
  },
  alertWrapper: {
    position: 'absolute',
    zIndex: 100,
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 40, 234, 0.2)',
  },
  alertContainer: {
    width: '90%',
    backgroundColor: 'rgb(45, 153, 70)',
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertDefText: {
    fontSize: 18,
    color: '#fff',
  },
  alertTextHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default appStyles;
