import './src/global.css';
import { useState, useEffect, useRef } from 'react';
import { Image, View, Text, StatusBar } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SettingsScreen from './src/screens/SettingsScreen';
import GeneralScreen from './src/screens/GeneralScreen';
import EntryScreen from './src/screens/EntryScreen';
import ServicesScreen from './src/screens/ServicesScreen';

import { ThemeProvider, useTheme } from './context/ThemeProvider';
import { ProfileProvider } from './context/ProfileContext';
import { darkTheme, lightTheme } from './assets/styles/styles';
import { ProfileIconWithDescription } from './src/components/ProfileIconWithDescription';
import { DataProvider } from './context/DataContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <DataProvider>
          <MainApp />
        </DataProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}

function MainApp() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar
        barStyle={theme === 'dark' ? "light-content" : "dark-content"}
      />
      <Tab.Navigator
        initialRouteName="General"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'General') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Services') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Entry') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
          headerShown: false, // Disable native headers
          tabBarActiveTintColor: '#6366F1',
          tabBarInactiveTintColor: theme === 'dark' ? '#94A3B8' : '#64748B',
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            height: 94,
            paddingBottom: 36,
            paddingTop: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen
          name='General'
          component={GeneralScreen}
          options={{ title: "Главная" }}
        />
        <Tab.Screen
          name='Entry'
          component={EntryScreen}
          options={{ title: "Ввод" }}
        />
        <Tab.Screen
          name='Services'
          component={ServicesScreen}
          options={{ title: "Услуги" }}
        />


        <Tab.Screen
          name='Settings'
          component={SettingsScreen}
          options={{ title: "Настройки" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
