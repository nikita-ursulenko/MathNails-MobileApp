import React from 'react';
import { Text, View, Switch, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeProvider';
import ScreenHeader from '../components/ui/ScreenHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getColors, typography, spacing, borderRadius } from '../theme';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const colors = getColors(theme);

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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Настройки" />

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.base }}>
        {/* Theme Settings */}
        <Card style={{ marginBottom: spacing.base }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: typography.fontSize.body,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text,
                marginBottom: spacing.xs,
              }}>
                Тёмная тема
              </Text>
              <Text style={{
                fontSize: typography.fontSize.caption,
                color: colors.textSecondary,
              }}>
                Переключить между светлой и тёмной темой
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.textTertiary, true: colors.primaryLight }}
              thumbColor={theme === 'dark' ? colors.primary : '#f4f3f4'}
              ios_backgroundColor={colors.textTertiary}
              onValueChange={toggleTheme}
              value={theme === 'dark'}
            />
          </View>
        </Card>

        {/* Danger Zone */}
        <View style={{ marginTop: spacing.xl }}>
          <Text style={{
            fontSize: typography.fontSize.caption,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textSecondary,
            marginBottom: spacing.md,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
            Опасная зона
          </Text>

          <Card style={{ borderColor: colors.danger, borderWidth: 1 }}>
            <Text style={{
              fontSize: typography.fontSize.body,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text,
              marginBottom: spacing.xs,
            }}>
              Сбросить все данные
            </Text>
            <Text style={{
              fontSize: typography.fontSize.caption,
              color: colors.textSecondary,
              marginBottom: spacing.base,
            }}>
              Это действие удалит все записи, услуги и настройки. Восстановление невозможно.
            </Text>
            <Button
              title="Удалить все данные"
              variant="danger"
              onPress={handleClearData}
            />
          </Card>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;

