import './src/global.css';
import { useState, useEffect, useRef } from 'react';
import { Image, View, Text, StatusBar } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProfilScreen from './src/screens/ProfilScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GeneralScreen from './src/screens/GeneralScreen';
import EntryScreen from './src/screens/EntryScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import StaticScreen from './src/screens/StaticScreen';
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
            } else if (route.name === 'Static') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Profil') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: 'gray',
          headerShown: true, // Keep headers visible as per standard iOS/Android patterns
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
          name='Static'
          component={StaticScreen}
          options={{ title: "Статистика" }}
        />
        <Tab.Screen
          name='Profil'
          component={ProfilScreen}
          options={{ title: "Профиль" }}
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
