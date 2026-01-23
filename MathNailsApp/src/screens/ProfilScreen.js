import React, { useState, useEffect } from "react";
import { View, Image, TextInput, Alert, Text, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useTheme } from "../../context/ThemeProvider";
import { useProfile } from "../../context/ProfileContext";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../components/ui/ScreenHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getColors, typography, spacing, borderRadius } from "../theme";

const ProfilScreen = () => {
  const { profileData, updateProfileData } = useProfile();
  const [firstName, setFirstName] = useState(profileData.firstName || '');
  const [lastName, setLastName] = useState(profileData.lastName || '');
  const [selectedPercent, setSelectedPercent] = useState(profileData.commissionRate || '50');
  const { theme } = useTheme();
  const navigation = useNavigation();
  const colors = getColors(theme);

  useEffect(() => {
    setFirstName(profileData.firstName || '');
    setLastName(profileData.lastName || '');
    setSelectedPercent(profileData.commissionRate ? profileData.commissionRate.toString() : '50');
  }, [profileData]);

  const saveProfileData = () => {
    updateProfileData({
      firstName,
      lastName,
      commissionRate: parseInt(selectedPercent, 10)
    });
    Alert.alert(
      'Данные изменены.',
      '',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('General')
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Профиль" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.base, paddingBottom: spacing['4xl'] }}
      >
        {/* Profile Avatar */}
        <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.surface,
            borderWidth: 3,
            borderColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
            <Image
              source={require('../../assets/profil.png')}
              style={{ width: 90, height: 90, borderRadius: 45 }}
            />
          </View>
        </View>

        {/* Personal Information */}
        <Card style={{ marginBottom: spacing.base }}>
          <Text style={{
            fontSize: typography.fontSize.h4,
            fontWeight: typography.fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.base,
          }}>
            Личная информация
          </Text>

          <Text style={{
            fontSize: typography.fontSize.caption,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textSecondary,
            marginBottom: spacing.sm,
          }}>
            Имя
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.background,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: typography.fontSize.body,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: spacing.base,
            }}
            placeholder="Ваше имя"
            placeholderTextColor={colors.textTertiary}
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={{
            fontSize: typography.fontSize.caption,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textSecondary,
            marginBottom: spacing.sm,
          }}>
            Фамилия
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.background,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: typography.fontSize.body,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            placeholder="Ваша фамилия"
            placeholderTextColor={colors.textTertiary}
            value={lastName}
            onChangeText={setLastName}
          />
        </Card>

        {/* Commission Settings */}
        <Card style={{ marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.fontSize.h4,
            fontWeight: typography.fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            Настройки комиссии
          </Text>
          <Text style={{
            fontSize: typography.fontSize.caption,
            color: colors.textSecondary,
            marginBottom: spacing.base,
          }}>
            Выберите процент вашей комиссии от каждой услуги
          </Text>

          <View style={{
            backgroundColor: colors.background,
            borderRadius: borderRadius.md,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
          }}>
            <Picker
              selectedValue={selectedPercent}
              onValueChange={(itemValue) => setSelectedPercent(itemValue)}
              style={{ color: colors.text }}
            >
              <Picker.Item label="Мой процент 50%" value="50" color={colors.text} />
              <Picker.Item label="Мой процент 40%" value="40" color={colors.text} />
            </Picker>
          </View>
        </Card>

        <Button
          title="Сохранить изменения"
          variant="primary"
          onPress={saveProfileData}
        />
      </ScrollView>
    </View>
  );
}

export default ProfilScreen;
