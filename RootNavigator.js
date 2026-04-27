import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useTrades } from '../context/TradeContext';
import { darkTheme, lightTheme } from '../styles/theme';

import DashboardScreen from '../screens/DashboardScreen';
import AddTradeScreen from '../screens/AddTradeScreen';
import TradeHistoryScreen from '../screens/TradeHistoryScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons = { Dashboard: '🏠', History: '📋', Analytics: '📊', Settings: '⚙️' };

function TabNavigator() {
  const { isDark } = useTrades();
  const t = isDark ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: t.surface, borderTopColor: t.border, height: 70, paddingBottom: 10 },
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.textMuted,
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>{icons[route.name]}</Text>,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="History" component={TradeHistoryScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isDark } = useTrades();
  const t = isDark ? darkTheme : lightTheme;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="AddTrade"
          component={AddTradeScreen}
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Log Trade',
            headerStyle: { backgroundColor: t.surface },
            headerTintColor: t.text,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
