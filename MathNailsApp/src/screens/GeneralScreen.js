// GeneralScreen.js

import React, { useState, useEffect } from 'react';
import { View, RefreshControl, Text, ScrollView, TouchableOpacity } from 'react-native';
import { loadDataFromDB, transformData } from '../utils/dataHelpers';
import moment from 'moment';
import 'moment/locale/ru';
import { useTheme } from '../../context/ThemeProvider';
import { useData } from '../../context/DataContext';
import MonthlyExpandableSection from '../components/MonthlyExpandableSection';
import ScreenHeader from '../components/ui/ScreenHeader';
import Card from '../components/ui/Card';
import { getColors, typography, spacing, borderRadius, shadows } from '../theme';

moment.locale('ru');

const MainScreen = () => {
  const { data, updateData } = useData();
  const [activeTab, setActiveTab] = useState(7);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const colors = getColors(theme);

  useEffect(() => {
    updateData(loadDataFromDB);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await updateData(loadDataFromDB);
    setRefreshing(false);
  };

  // Filter data based on selected tab
  const filteredTotalsData = data.filter(item => {
    const itemDate = moment(item.date, 'DD.MM.YY');
    const diffDays = moment().diff(itemDate, 'days');
    return diffDays < activeTab;
  });

  const totals = filteredTotalsData.reduce((acc, curr) => {
    acc.cost += curr.cost;
    acc.netProfit += curr.netProfit;
    acc.tips += curr.tips;
    return acc;
  }, { cost: 0, netProfit: 0, tips: 0 });

  const transformedData = transformData(filteredTotalsData);

  const SummaryCard = ({ title, value, icon, color }) => (
    <Card style={{ marginRight: spacing.md, minWidth: 140, padding: spacing.base }}>
      <Text style={{
        fontSize: typography.fontSize.label,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing.sm,
      }}>
        {title}
      </Text>
      <Text style={{
        fontSize: typography.fontSize.h3,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
      }}>
        {value.toFixed(2)}€
      </Text>
    </Card>
  );

  const TabButton = ({ value, label }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(value)}
      style={{
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: activeTab === value ? colors.primary : colors.surface,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: activeTab === value ? colors.primary : colors.border,
      }}
      activeOpacity={0.7}
    >
      <Text style={{
        color: activeTab === value ? colors.textInverse : colors.textSecondary,
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.semibold,
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Ваш Дашборд" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard Summary */}
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.base }}>
          <View style={{ flexDirection: 'row', marginBottom: spacing.lg }}>
            <TabButton value={7} label="7 дней" />
            <TabButton value={14} label="14 дней" />
            <TabButton value={30} label="Месяц" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xl }}>
            <SummaryCard title="Общая выручка" value={totals.cost} color={colors.primary} />
            <SummaryCard title="Чистая прибыль" value={totals.netProfit} color={colors.success} />
            <SummaryCard title="Чаевые" value={totals.tips} color={colors.warning} />
          </ScrollView>
        </View>

        {/* Records Section */}
        <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.fontSize.h3,
            fontWeight: typography.fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            История записей
          </Text>
          {transformedData.length > 0 ? (
            transformedData.map((item, index) => (
              <MonthlyExpandableSection key={index} monthlyData={item} />
            ))
          ) : (
            <View style={{ alignItems: 'center', marginTop: spacing['4xl'], paddingVertical: spacing['3xl'] }}>
              <Text style={{ color: colors.textSecondary, textAlign: 'center', fontSize: typography.fontSize.body }}>
                Нет записей для отображения
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MainScreen;
