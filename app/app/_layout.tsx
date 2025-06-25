"use client"

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins"
import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import React, { useCallback } from "react"
import { StyleSheet, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Import providers
import { AuthProvider } from "../context/AuthContext"
import { ThemeProvider, useTheme } from "../context/ThemeContext"

// Import screens
import FlightDetailsScreen from "./screens/FlightDetailsScreen"
import FlightResultsScreen from "./screens/FlightResultsScreen"
import HomeScreen from "./screens/HomeScreen"
import LoginScreen from "./screens/LoginScreen"
import MyBookingsScreen from "./screens/MyBookingsScreen"
import PaymentScreen from "./screens/PaymentScreen"
import ProfileScreen from "./screens/ProfileScreen"
import SignUpScreen from "./screens/SignUpScreen"
import WelcomeScreen from "./screens/WelcomeScreen"

// Profile Screens
import AboutScreen from "./screens/profile/AboutScreen"
import FrequentFlyerScreen from "./screens/profile/FrequentFlyerScreen"
import HelpSupportScreen from "./screens/profile/HelpSupportScreen"
import PaymentMethodsScreen from "./screens/profile/PaymentMethodsScreen"
import PersonalInfoScreen from "./screens/profile/PersonalInfoScreen"
import SettingsScreen from "./screens/profile/SettingScreen"
import TravelPreferencesScreen from "./screens/profile/TravelPreferencesScreen"

// Admin Screens
import AdminBookingsScreen from "./screens/admin/AdminBookingsScreen"
import AdminDashboardScreen from "./screens/admin/AdminDashboardScreen"
import AdminFlightFormScreen from "./screens/admin/AdminFlightFormScreen"
import AdminFlightsScreen from "./screens/admin/AdminFlightsScreen"
import AdminPaymentsScreen from "./screens/admin/AdminPaymentsScreen"
import AdminUsersScreen from "./screens/admin/AdminUsersScreen"

// Splash
import Splash from "./screens/SplashScreen"

// Theme
import { COLORS } from "../constants/theme"

// Navigation Types
export type RootStackParamList = {
  Splash: undefined
  Welcome: undefined
  Login: undefined
  SignUp: undefined
  Main: undefined
  Admin: undefined
  FlightResults: {
    flights?: any[]
    searchParams: {
      from: string
      to: string
      departureDate: string
      returnDate?: string
      passengers: number
      class: string
    }
  }
  FlightDetails: {
    flight: any
    booking?: any
    searchParams?: any
  }
  Payment: { flight: any; passengerDetails?: any }
  PersonalInfo: undefined
  PaymentMethods: undefined
  TravelPreferences: undefined
  FrequentFlyer: undefined
  HelpSupport: undefined
  About: undefined
  Settings: undefined
  MyBookings: undefined
  AdminFlightForm: undefined
}

export type TabParamList = {
  Home: undefined
  MyBookings: undefined
  Profile: undefined
}

export type AdminTabParamList = {
  Dashboard: undefined
  Flights: undefined
  Bookings: undefined
  Users: undefined
  Payments: undefined
}

const Stack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()
const AdminTab = createBottomTabNavigator<AdminTabParamList>()

// Prevent splash from auto hiding
SplashScreen.preventAutoHideAsync()

function MainTabs() {
  const { theme } = useTheme()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home"
          if (route.name === "Home") iconName = focused ? "home" : "home-outline"
          else if (route.name === "MyBookings") iconName = focused ? "calendar" : "calendar-outline"
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline"

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyBookings" component={MyBookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

function AdminTabs() {
  const { theme } = useTheme()
  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home"
          if (route.name === "Dashboard") iconName = focused ? "grid" : "grid-outline"
          else if (route.name === "Flights") iconName = focused ? "airplane" : "airplane-outline"
          else if (route.name === "Bookings") iconName = focused ? "calendar" : "calendar-outline"
          else if (route.name === "Users") iconName = focused ? "people" : "people-outline"
          else if (route.name === "Payments") iconName = focused ? "card" : "card-outline"

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
        },
        headerShown: false,
      })}
    >
      <AdminTab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <AdminTab.Screen name="Flights" component={AdminFlightsScreen} />
      <AdminTab.Screen name="Bookings" component={AdminBookingsScreen} />
      <AdminTab.Screen name="Users" component={AdminUsersScreen} />
      <AdminTab.Screen name="Payments" component={AdminPaymentsScreen} />
    </AdminTab.Navigator>
  )
}

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Admin" component={AdminTabs} />
      <Stack.Screen name="FlightResults" component={FlightResultsScreen} />
      <Stack.Screen name="FlightDetails" component={FlightDetailsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="TravelPreferences" component={TravelPreferencesScreen} />
      <Stack.Screen name="FrequentFlyer" component={FrequentFlyerScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AdminFlightForm" component={AdminFlightFormScreen} />
    </Stack.Navigator>
  )
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <AuthProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

function ThemedApp() {
  const { theme } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="auto" />
      <RootStack />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
