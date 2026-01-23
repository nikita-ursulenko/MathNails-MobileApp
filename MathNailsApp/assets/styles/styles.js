// styles.js
import { StyleSheet } from 'react-native';

export const ProfilScreen = StyleSheet.create({
  Container: {
    width: "100%",
    alignItems: "center",
  },
  ProfilContainer: {
    width: "100%",
    alignItems: "center",
  },
  ProfileImage: {
    width: 150,
    height: 150,
    marginTop: 20,
  },
  TextName: {
    marginTop: 20,
    height: 50,
    padding: 10,
    width: "70%",
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 50,
    marginBottom: 10,
    paddingLeft: 10
  },
  FlexUp: {
    height: "90%",
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center"
  },
  ButtonSpecial: {
    width: "50%",
  },
});
export const GeneralScreen = StyleSheet.create({
  header: {
    marginTop: 10,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 4,
    alignItems: 'center',
    backgroundColor: "rgba(12,121,232,0.5)",
    borderRadius: 20,
  },
  content: {
    padding: 10,

  },
  contentText: {
    fontSize: 20,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 20,
  },
  moreDetailsButton: {
    alignSelf: "flex-end",
    marginTop: -40,
  },
  generalView: {
    height: "100%",
  },
});
export const EntryScreen = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 4,
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 2,
    backgroundColor: "white",
    borderColor: "rgb(11,119,226)",
  },
  headerText: {
    fontSize: 20,

  },
  content: {
    padding: 10,
  },
  contentItem: {
    paddingHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  contentItemText: {
    fontSize: 24,
  },

});
export const ServicesScreen = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",
    backgroundColor: "white",
  },
  input: {
    borderWidth: 2,
    padding: 10,
    fontSize: 20,
    marginBottom: 30,
    borderRadius: 50,
    width: "80%",
  },
  renderList: {
    height: "100%",
  },
  servicesScreen: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    padding: 10,
    borderBottomWidth: 2,
  },
  nameStyle: {
    fontSize: 20,
  },
  costStyle: {
    fontSize: 24,
  },
  selectedServiceText: {
    flex: 1,
    justifyContent: "center",
  },
  selectedServiceTextView: {
    borderBottomWidth: 2,
    padding: 10,
  },
  selectedServiceTextInner: {
    textAlign: "center",
    fontSize: 24,
  },
  selectedServiceButton: {
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  changeView: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "white",
  },
  modalView: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: "center",
    height: "90%",
    marginTop: "10%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
});
export const SettingsScreen = StyleSheet.create({
  containerSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export const lightTheme = StyleSheet.create({
  ...ProfilScreen,
  ...GeneralScreen,
  ...EntryScreen,
  ...ServicesScreen,
  ...SettingsScreen,
  text: {
    fontSize: 18,
    color: '#2D3436',
    fontWeight: '500',
  },
  headerText: {
    ...GeneralScreen.headerText,
    color: "#2D3436",
    fontWeight: '700',
  },
  contentText: {
    ...GeneralScreen.contentText,
    color: "#636E72",
  },
  header: {
    ...GeneralScreen.header,
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8EE",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderRadius: 16,
  },
  content: {
    ...GeneralScreen.content,
    zIndex: -1,
    marginHorizontal: 12,
    marginTop: -20,
    paddingTop: 28,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  contentItem: {
    ...EntryScreen.contentItem,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F3F5',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
});

export const darkTheme = StyleSheet.create({
  ...ProfilScreen,
  ...GeneralScreen,
  ...EntryScreen,
  ...ServicesScreen,
  ...SettingsScreen,

  text: {
    fontSize: 18,
    color: '#FDFEFE',
    fontWeight: '500',
  },
  headerText: {
    ...GeneralScreen.headerText,
    color: "#FFFFFF",
    fontWeight: '700',
  },
  contentText: {
    color: "#B2BEC3",
    fontSize: 17,
  },
  header: {
    ...GeneralScreen.header,
    backgroundColor: "#1E272E",
    borderColor: "#2F3640",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    borderRadius: 16,
  },
  content: {
    ...GeneralScreen.content,
    zIndex: -1,
    marginHorizontal: 12,
    marginTop: -20,
    paddingTop: 28,
    backgroundColor: '#111827',
    borderRadius: 16,
  },
  contentItem: {
    ...EntryScreen.contentItem,
    backgroundColor: "#2C3E50",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#34495E',
  },
  sectionHeader: {
    ...EntryScreen.sectionHeader,
    backgroundColor: "#2D3436",
    borderColor: "#444",
    borderRadius: 16,
  },
  contentItemText: {
    ...EntryScreen.contentItemText,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  servicesScreen: {
    ...ServicesScreen.servicesScreen,
    borderColor: "#34495E",
    backgroundColor: '#1E272E',
    borderRadius: 12,
    marginBottom: 8,
  },
  modalContainer: {
    ...ServicesScreen.modalContainer,
    backgroundColor: "#0F172A",
  },
  changeView: {
    ...ServicesScreen.changeView,
    backgroundColor: "#0F172A"
  },
  input: {
    ...ServicesScreen.input,
    borderColor: "#334155",
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
  },
});

