"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"
import type { ScreenNavigationProp } from "../../../types"

interface TravelPreferencesScreenProps {
  navigation: ScreenNavigationProp<"TravelPreferences">
}

const TravelPreferencesScreen: React.FC<TravelPreferencesScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()

  const [preferences, setPreferences] = useState({
    seatPreference: "Window",
    mealPreference: "Regular",
    classPreference: "Economy",
    notifications: {
      flightUpdates: true,
      priceAlerts: true,
      promotions: false,
    },
    accessibility: {
      wheelchairAssistance: false,
      specialMeals: false,
    },
  })

  const seatOptions = ["Window", "Aisle", "No Preference"]
  const mealOptions = ["Regular", "Vegetarian", "Vegan", "Halal", "Kosher"]
  const classOptions = ["Economy", "Business", "First"]

  const handleSave = async () => {
    try {
      // In a real app, this would save to the API
      // await updateTravelPreferences(preferences)
      Alert.alert("Success", "Travel preferences updated successfully")
      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", "Failed to update preferences")
    }
  }

  const renderOptionSelector = (
    title: string,
    options: string[],
    selectedValue: string,
    onSelect: (value: string) => void,
  ) => (
    <Card style={[styles.sectionCard, { backgroundColor: theme.white }]}>
      <Text style={[styles.sectionTitle, { color: theme.black }]}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              {
                backgroundColor: selectedValue === option ? `${theme.primary}20` : theme.lightGray,
                borderColor: selectedValue === option ? theme.primary : "transparent",
              },
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color: selectedValue === option ? theme.primary : theme.gray,
                  fontFamily: selectedValue === option ? FONTS.semiBold : FONTS.regular,
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.background === COLORS.background ? "dark" : "light"} />
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.lightGray }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.black }]}>Travel Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderOptionSelector("Seat Preference", seatOptions, preferences.seatPreference, (value) =>
          setPreferences({ ...preferences, seatPreference: value }),
        )}

        {renderOptionSelector("Meal Preference", mealOptions, preferences.mealPreference, (value) =>
          setPreferences({ ...preferences, mealPreference: value }),
        )}

        {renderOptionSelector("Class Preference", classOptions, preferences.classPreference, (value) =>
          setPreferences({ ...preferences, classPreference: value }),
        )}

        <Card style={[styles.sectionCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Notifications</Text>

          <View style={styles.switchItem}>
            <View style={styles.switchTextContainer}>
              <Text style={[styles.switchTitle, { color: theme.black }]}>Flight Updates</Text>
              <Text style={[styles.switchDescription, { color: theme.gray }]}>
                Get notified about flight delays and gate changes
              </Text>
            </View>
            <Switch
              value={preferences.notifications.flightUpdates}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, flightUpdates: value },
                })
              }
              trackColor={{ false: theme.lightGray, true: `${theme.primary}80` }}
              thumbColor={preferences.notifications.flightUpdates ? theme.primary : theme.white}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchTextContainer}>
              <Text style={[styles.switchTitle, { color: theme.black }]}>Price Alerts</Text>
              <Text style={[styles.switchDescription, { color: theme.gray }]}>
                Get notified when flight prices drop
              </Text>
            </View>
            <Switch
              value={preferences.notifications.priceAlerts}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, priceAlerts: value },
                })
              }
              trackColor={{ false: theme.lightGray, true: `${theme.primary}80` }}
              thumbColor={preferences.notifications.priceAlerts ? theme.primary : theme.white}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchTextContainer}>
              <Text style={[styles.switchTitle, { color: theme.black }]}>Promotions</Text>
              <Text style={[styles.switchDescription, { color: theme.gray }]}>
                Receive promotional offers and deals
              </Text>
            </View>
            <Switch
              value={preferences.notifications.promotions}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, promotions: value },
                })
              }
              trackColor={{ false: theme.lightGray, true: `${theme.primary}80` }}
              thumbColor={preferences.notifications.promotions ? theme.primary : theme.white}
            />
          </View>
        </Card>

        <Card style={[styles.sectionCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Accessibility</Text>

          <View style={styles.switchItem}>
            <View style={styles.switchTextContainer}>
              <Text style={[styles.switchTitle, { color: theme.black }]}>Wheelchair Assistance</Text>
              <Text style={[styles.switchDescription, { color: theme.gray }]}>
                Request wheelchair assistance for flights
              </Text>
            </View>
            <Switch
              value={preferences.accessibility.wheelchairAssistance}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  accessibility: { ...preferences.accessibility, wheelchairAssistance: value },
                })
              }
              trackColor={{ false: theme.lightGray, true: `${theme.primary}80` }}
              thumbColor={preferences.accessibility.wheelchairAssistance ? theme.primary : theme.white}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchTextContainer}>
              <Text style={[styles.switchTitle, { color: theme.black }]}>Special Meals</Text>
              <Text style={[styles.switchDescription, { color: theme.gray }]}>
                Automatically request special meals based on preferences
              </Text>
            </View>
            <Switch
              value={preferences.accessibility.specialMeals}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  accessibility: { ...preferences.accessibility, specialMeals: value },
                })
              }
              trackColor={{ false: theme.lightGray, true: `${theme.primary}80` }}
              thumbColor={preferences.accessibility.specialMeals ? theme.primary : theme.white}
            />
          </View>
        </Card>

        <Button title="Save Preferences" onPress={handleSave} gradient style={styles.saveButton} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sectionCard: {
    marginTop: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: SIZES.small,
  },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
  },
  switchDescription: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  saveButton: {
    marginTop: 32,
  },
})

export default TravelPreferencesScreen
