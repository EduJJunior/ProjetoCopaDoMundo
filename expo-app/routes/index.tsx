import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import AlbumScreen from '../screens/AlbumScreen';
import DetailsScreen from '../screens/DetailsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import QuizScreen from '../screens/QuizScreen';
import OdsScreen from '../screens/OdsScreen';
import { theme } from '../styles/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AlbumStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: theme.colors.primary }}>
      <Stack.Screen name="AlbumMain" component={AlbumScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes do Item' }} />
    </Stack.Navigator>
  );
}

export default function Routes() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopWidth: 1, borderColor: theme.colors.border }
      }}>
        <Tab.Screen name="Álbum" component={AlbumStack} />
        <Tab.Screen name="Histórico" component={HistoryScreen} />
        <Tab.Screen name="Quiz" component={QuizScreen} />
        <Tab.Screen name="ODS ONU" component={OdsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}