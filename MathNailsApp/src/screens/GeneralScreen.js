// GeneralScreen.js

import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadDataFromDB, transformData } from '../utils/dataHelpers';
import ExpandableSection from '../components/ExpandableSection';
import moment from 'moment';
import 'moment/locale/ru';
import { useTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../assets/styles/styles';
import EntryScreen from './EntryScreen';
import { useData } from '../../context/DataContext';
import MonthlyExpandableSection from '../components/MonthlyExpandableSection';


moment.locale('ru');

// Logic extracted to src/utils/dataHelpers.js

const MainScreen = () => {
  const { data, updateData } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const themeContext = useTheme();
  const { theme } = themeContext;
  const styles = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    updateData(loadDataFromDB);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await updateData(loadDataFromDB);
    setRefreshing(false);
  };

  const totals = data.reduce((acc, curr) => {
    acc.cost += curr.cost;
    acc.netProfit += curr.netProfit;
    acc.tips += curr.tips;
    return acc;
  }, { cost: 0, netProfit: 0, tips: 0 });

  const transformedData = transformData(data);

  const SummaryCard = ({ title, value, icon, color }) => (
    <View style={{
      backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
      borderRadius: 20,
      padding: 16,
      marginRight: 12,
      minWidth: 140,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }}>
      <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', marginBottom: 8 }}>{title}</Text>
      <Text style={{ fontSize: 20, fontWeight: '700', color: theme === 'dark' ? 'white' : '#1E293B' }}>{value.toFixed(2)}€</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#0F172A' : '#F8FAFC' }}>
      <ScrollView
        stickyHeaderIndices={[1]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />
        }
      >
        {/* Dashboard Summary */}
        <View style={{ padding: 20, paddingTop: 10 }}>
          <Text style={[styles.text, { fontSize: 24, fontWeight: '700', marginBottom: 16 }]}>Ваш Дашборд</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 10 }}>
            <SummaryCard title="Общая выручка" value={totals.cost} color="#6366F1" />
            <SummaryCard title="Чистая прибыль" value={totals.netProfit} color="#22C55E" />
            <SummaryCard title="Чаевые" value={totals.tips} color="#F59E0B" />
          </ScrollView>
        </View>

        {/* Records Section */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={[styles.text, { fontSize: 20, fontWeight: '700', marginBottom: 12 }]}>История записей</Text>
          {transformedData.length > 0 ? (
            transformedData.map((item, index) => (
              <MonthlyExpandableSection key={index} monthlyData={item} />
            ))
          ) : (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#64748B', textAlign: 'center' }}>Нет записей для отображения</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <EntryScreen reloadMainScreen={onRefresh} />
    </View>
  );
};

export default MainScreen;
