import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkTheme, lightTheme } from '../../assets/styles/styles';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useTheme } from '../../context/ThemeProvider';



const DailyDetails = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const themeContext = useTheme();
  const { theme } = themeContext;
  const styles = theme === 'dark' ? darkTheme : lightTheme;

  const toggleMoreDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const dateFormatted = moment(data.date, 'DD.MM.YY').format('dddd, DD.MM.YY');
  // Преобразуем первую букву в заглавную
  const capitalizedDay = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
  const dayOfWeek = capitalizedDay.split(',')[0];
  const date = capitalizedDay.split(',')[1];

  return (
    <View style={{ marginBottom: 12 }}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={[styles.header, {
          backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
          borderRadius: 16,
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderWidth: 1,
          borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
        }]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 8, height: 8, borderRadius: 4,
            backgroundColor: dayOfWeek.includes('суббота') || dayOfWeek.includes('воскресенье') ? '#EF4444' : '#6366F1',
            marginRight: 10
          }} />
          <Text style={[styles.headerText, { fontWeight: '600', color: theme === 'dark' ? 'white' : '#1E293B' }]}>
            {dayOfWeek} {date}
          </Text>
        </View>
        <AntDesign name={expanded ? "up" : "down"} size={18} color={theme === 'dark' ? "#94A3B8" : "#64748B"} />
      </TouchableOpacity>

      {expanded && (
        <View style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
          marginHorizontal: 8,
          marginTop: -8,
          paddingTop: 16,
          paddingBottom: 16,
          paddingHorizontal: 16,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
          zIndex: -1
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View>
              <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Выручка</Text>
              <Text style={[styles.text, { fontWeight: '700', fontSize: 18 }]}>{data.cost.toFixed(2)}€</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Прибыль</Text>
              <Text style={[styles.text, { fontWeight: '700', fontSize: 18, color: '#22C55E' }]}>{data.earnings.toFixed(2)}€</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#334155' : '#F1F5F9', marginVertical: 8 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <View>
              <Text style={{ fontSize: 11, color: '#64748B' }}>Нал: {data.myBar.toFixed(2)}€</Text>
              <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Карта: {data.moneySalon.toFixed(2)}€</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 11, color: data.debt > 0 ? '#EF4444' : '#22C55E', fontWeight: '600' }}>
                {data.debtStatus}: {Math.abs(data.debt).toFixed(2)}€
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={toggleMoreDetails}
            style={{
              alignSelf: 'center',
              marginTop: 12,
              backgroundColor: theme === 'dark' ? '#1E293B' : '#F8FAFC',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12
            }}
          >
            <Text style={{ fontSize: 12, color: '#6366F1', fontWeight: '600' }}>
              {showMoreDetails ? 'Скрыть детали' : 'Подробнее'}
            </Text>
          </TouchableOpacity>

          {showMoreDetails && (
            <View style={{ marginTop: 12, backgroundColor: theme === 'dark' ? '#0F172A' : '#F1F5F9', padding: 12, borderRadius: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 13, color: '#64748B' }}>Чаевые:</Text>
                <Text style={[styles.text, { fontSize: 13, fontWeight: '600' }]}>{data.tips.toFixed(2)}€</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: '#64748B' }}>Чистая прибыль:</Text>
                <Text style={[styles.text, { fontSize: 13, fontWeight: '700', color: '#6366F1' }]}>{data.netProfit.toFixed(2)}€</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default DailyDetails;
