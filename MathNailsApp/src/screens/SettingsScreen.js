import { Text, View, Switch, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeProvider';
import { lightTheme, darkTheme } from '../../assets/styles/styles';

const SettingsScreen = () => {
  const themeContext = useTheme();
  const { theme, toggleTheme } = themeContext;
  const styles = theme === 'dark' ? darkTheme : lightTheme;

  if (!themeContext) {
    console.error('ThemeContext not found');
    return null;
  }

  const handleClearData = async () => {
    Alert.alert(
      "Сброс данных",
      "Вы уверены, что хотите удалить ВСЕ данные приложения? Это действие нельзя отменить.",
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        {
          text: "Удалить все",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Успешно", "Все данные удалены. Перезапустите приложение.");
            } catch (e) {
              Alert.alert("Ошибка", "Не удалось очистить данные.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.containerSettings}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
        <Text style={styles.text}>Тёмная тема</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleTheme}
          value={theme === 'dark'}
        />
      </View>

      <TouchableOpacity
        onPress={handleClearData}
        style={{
          backgroundColor: '#EF4444',
          padding: 15,
          borderRadius: 12,
          width: '100%',
          alignItems: 'center',
          marginTop: 20
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Сбросить все данные</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

