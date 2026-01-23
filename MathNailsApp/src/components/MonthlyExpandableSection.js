import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useTheme } from '../../context/ThemeProvider';
import DailyDetails from './DailyDetails';
import { darkTheme, lightTheme } from '../../assets/styles/styles';
import { AntDesign } from '@expo/vector-icons';

const MonthlyExpandableSection = ({ monthlyData }) => {
    const [expandedMonth, setExpandedMonth] = useState(null);
    const themeContext = useTheme();
    const { theme } = themeContext;
    const styles = theme === 'dark' ? darkTheme : lightTheme;

    return (
        <View style={{ marginBottom: 16 }}>
            {monthlyData && monthlyData.days && monthlyData.days.length > 0 && (
                <View key={monthlyData.label}>
                    <TouchableOpacity
                        onPress={() => setExpandedMonth(expandedMonth === monthlyData.label ? null : monthlyData.label)}
                        style={[styles.header, {
                            backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
                            borderRadius: 16,
                            paddingHorizontal: 20,
                            paddingVertical: 16,
                            borderWidth: 0,
                        }]}
                    >
                        <Text style={[styles.headerText, { fontWeight: '700', color: theme === 'dark' ? 'white' : '#1E293B' }]}>
                            {moment(monthlyData.label, 'MM.YYYY').format('MMMM YYYY').charAt(0).toUpperCase() + moment(monthlyData.label, 'MM.YYYY').format('MMMM YYYY').slice(1)}
                        </Text>
                        <AntDesign
                            name={expandedMonth === monthlyData.label ? "up" : "down"}
                            size={20}
                            color={theme === 'dark' ? "#94A3B8" : "#64748B"}
                        />
                    </TouchableOpacity>
                    {expandedMonth === monthlyData.label && (
                        <View style={{ paddingTop: 8 }}>
                            {monthlyData.days.map(day => (
                                <DailyDetails key={day.date} data={day} />
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default MonthlyExpandableSection;
