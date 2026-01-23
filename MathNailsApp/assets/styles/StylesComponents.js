import { StyleSheet } from 'react-native';

export const components = StyleSheet.create({
  button: {
    backgroundColor: '#6366F1', // Premium Indigo
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  addButton: {
    zIndex: 999,
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    zIndex: 1,
    top: 50,
    right: 20,
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
  input: {
    height: 56,
    marginVertical: 8,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
    borderRadius: 12,
    width: "100%",
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    color: '#1E293B',
  },
  centerStyle: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    marginVertical: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  section: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 12,
  },
  paragraph: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
    color: '#475569',
  },
  checkbox: {
    margin: 8,
  },
});

export const lightThemeComponents = StyleSheet.create({
  ...components,
});

export const darkThemeComponents = StyleSheet.create({
  ...components,
  modalView: {
    ...components.modalView,
    backgroundColor: "#1E293B",
  },
  text: {
    color: "#F8FAFC",
  },
  input: {
    ...components.input,
    borderColor: "#334155",
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
  },
  centerStyle: {
    ...components.centerStyle,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  viewBlack: {
    backgroundColor: "#0F172A",
  }
})