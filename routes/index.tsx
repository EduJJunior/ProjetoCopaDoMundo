import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import AlbumScreen from '../screens/AlbumScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SelectionScreen from '../screens/SelectionScreen';
import SelectionsListScreen from '../screens/SelectionsListScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HistoryDetailScreen from '../screens/HistoryDetailScreen';
import QuizScreen from '../screens/QuizScreen';
import OdsScreen from '../screens/OdsScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();

function AlbumStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.colors.textInverse,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTitleStyle: { fontFamily: theme.typography.fontSemiBold },
      }}
    >
      <Stack.Screen name="AlbumMain" component={AlbumScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SelectionsList" component={SelectionsListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Selection" component={SelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Detalhes da Figurinha' }}
      />
    </Stack.Navigator>
  );
}

function HistoryStackNavigator() {
  const { theme } = useTheme();

  return (
    <HistoryStack.Navigator
      screenOptions={{
        headerTintColor: theme.colors.textInverse,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTitleStyle: { fontFamily: theme.typography.fontSemiBold },
      }}
    >
      <HistoryStack.Screen name="HistoryMain" component={HistoryScreen} options={{ headerShown: false }} />
      <HistoryStack.Screen
        name="HistoryDetail"
        component={HistoryDetailScreen}
        options={{ title: 'Detalhes da Copa' }}
      />
    </HistoryStack.Navigator>
  );
}

export default function Routes() {
  const { theme, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.secondary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.tabBar,
            borderTopWidth: 1,
            borderColor: theme.colors.tabBarBorder,
            height: Platform.OS === 'ios' ? 88 : 68,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
            paddingTop: 8,
            ...theme.shadows.sm,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: theme.typography.fontSemiBold,
          },
          tabBarIcon: ({ focused, color, size }) => {
            const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
              Álbum: focused ? 'book' : 'book-outline',
              Histórico: focused ? 'time' : 'time-outline',
              Quiz: focused ? 'trophy' : 'trophy-outline',
              'ODS ONU': focused ? 'earth' : 'earth-outline',
            };
            return <Ionicons name={icons[route.name] ?? 'ellipse'} size={size - 2} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Álbum" component={AlbumStack} />
        <Tab.Screen name="Histórico" component={HistoryStackNavigator} />
        <Tab.Screen name="Quiz" component={QuizScreen} />
        <Tab.Screen name="ODS ONU" component={OdsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
