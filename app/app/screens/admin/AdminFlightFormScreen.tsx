"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { createFlight, updateFlight } from "../../../api/admin"
import Button from "../../../components/Button"
import Input from "../../../components/Input"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"
import type { Flight, ScreenNavigationProp } from "../../../types"

interface AdminFlightFormScreenProps {
  navigation: ScreenNavigationProp<"AdminFlightForm">
  route: {
    params?: {
      flight?: Flight
    }
  }
}

const AdminFlightFormScreen: React.FC<AdminFlightFormScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme()
  const isEditing = !!route.params?.flight
  const existingFlight = route.params?.flight

  const [formData, setFormData] = useState({
    flightNumber: existingFlight?.flightNumber || "",
    airline: existingFlight?.airline || "",
    origin: existingFlight?.origin || "",
    destination: existingFlight?.destination || "",
    departureTime: existingFlight?.departureTime || "",
    arrivalTime: existingFlight?.arrivalTime || "",
    price: existingFlight?.price?.toString() || "",
    availableSeats: existingFlight?.availableSeats?.toString() || "",
    duration: existingFlight?.duration?.toString() || "",
    stops: existingFlight?.stops?.toString() || "0",
    status: existingFlight?.status || "scheduled",
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    const requiredFields = [
      "flightNumber",
      "airline",
      "origin",
      "destination",
      "departureTime",
      "arrivalTime",
      "price",
      "availableSeats",
      "duration",
    ]

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        Alert.alert(
          "Validation Error",
          `${field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} is required`,
        )
        return false
      }
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      Alert.alert("Validation Error", "Price must be a valid positive number")
      return false
    }

    if (isNaN(Number(formData.availableSeats)) || Number(formData.availableSeats) < 0) {
      Alert.alert("Validation Error", "Available seats must be a valid non-negative number")
      return false
    }

    if (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      Alert.alert("Validation Error", "Duration must be a valid positive number (in minutes)")
      return false
    }

    if (isNaN(Number(formData.stops)) || Number(formData.stops) < 0) {
      Alert.alert("Validation Error", "Stops must be a valid non-negative number")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)

      const flightData = {
        flightNumber: formData.flightNumber,
        airline: formData.airline,
        origin: formData.origin,
        destination: formData.destination,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        price: Number(formData.price),
        availableSeats: Number(formData.availableSeats),
        duration: Number(formData.duration),
        stops: Number(formData.stops),
        status: formData.status as "scheduled" | "delayed" | "cancelled" | "completed",
      }
      console.log("Flight data submitted:", flightData)

      if (isEditing && existingFlight) {
        await updateFlight(existingFlight.id, flightData)
        Alert.alert("Success", "Flight updated successfully")
      } else {
        await createFlight(flightData)
        Alert.alert("Success", "Flight created successfully")
      }
      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to save flight")
    } finally {
      setLoading(false)
    }
  }

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
        <Text style={[styles.headerTitle, { color: theme.black }]}>{isEditing ? "Edit Flight" : "Add Flight"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Input
            label="Flight Number"
            placeholder="e.g., DL1234"
            value={formData.flightNumber}
            onChangeText={(value) => handleInputChange("flightNumber", value)}
            icon="airplane-outline"
            autoCapitalize="characters"
          />

          <Input
            label="Airline"
            placeholder="e.g., Delta Airlines"
            value={formData.airline}
            onChangeText={(value) => handleInputChange("airline", value)}
            icon="business-outline"
          />

          <View style={styles.rowContainer}>
            <Input
              label="Origin"
              placeholder="e.g., New York (JFK)"
              value={formData.origin}
              onChangeText={(value) => handleInputChange("origin", value)}
              style={{ flex: 1, marginRight: 8 }}
              icon="location-outline"
            />
            <Input
              label="Destination"
              placeholder="e.g., London (LHR)"
              value={formData.destination}
              onChangeText={(value) => handleInputChange("destination", value)}
              style={{ flex: 1, marginLeft: 8 }}
              icon="location-outline"
            />
          </View>

          <View style={styles.rowContainer}>
            <Input
              label="Departure Time"
              placeholder="YYYY-MM-DD HH:MM"
              value={formData.departureTime}
              onChangeText={(value) => handleInputChange("departureTime", value)}
              style={{ flex: 1, marginRight: 8 }}
              icon="time-outline"
            />
            <Input
              label="Arrival Time"
              placeholder="YYYY-MM-DD HH:MM"
              value={formData.arrivalTime}
              onChangeText={(value) => handleInputChange("arrivalTime", value)}
              style={{ flex: 1, marginLeft: 8 }}
              icon="time-outline"
            />
          </View>

          <View style={styles.rowContainer}>
            <Input
              label="Price (USD)"
              placeholder="e.g., 299"
              value={formData.price}
              onChangeText={(value) => handleInputChange("price", value)}
              style={{ flex: 1, marginRight: 8 }}
              icon="card-outline"
              keyboardType="numeric"
            />
            <Input
              label="Available Seats"
              placeholder="e.g., 150"
              value={formData.availableSeats}
              onChangeText={(value) => handleInputChange("availableSeats", value)}
              style={{ flex: 1, marginLeft: 8 }}
              icon="people-outline"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.rowContainer}>
            <Input
              label="Duration (minutes)"
              placeholder="e.g., 480"
              value={formData.duration}
              onChangeText={(value) => handleInputChange("duration", value)}
              style={{ flex: 1, marginRight: 8 }}
              icon="timer-outline"
              keyboardType="numeric"
            />
            <Input
              label="Stops"
              placeholder="e.g., 0"
              value={formData.stops}
              onChangeText={(value) => handleInputChange("stops", value)}
              style={{ flex: 1, marginLeft: 8 }}
              icon="git-branch-outline"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.statusContainer}>
            <Text style={[styles.statusLabel, { color: theme.black }]}>Status</Text>
            <View style={styles.statusOptions}>
              {["scheduled", "delayed", "cancelled", "completed"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    {
                      backgroundColor: formData.status === status ? theme.primary : theme.lightGray,
                      borderColor: formData.status === status ? theme.primary : "transparent",
                    },
                  ]}
                  onPress={() => handleInputChange("status", status)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      {
                        color: formData.status === status ? theme.white : theme.gray,
                        fontFamily: formData.status === status ? FONTS.semiBold : FONTS.regular,
                      },
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button
            title={isEditing ? "Update Flight" : "Create Flight"}
            onPress={handleSubmit}
            loading={loading}
            gradient
            style={styles.submitButton}
          />
        </View>
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
  formContainer: {
    marginTop: 16,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginBottom: 8,
  },
  statusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    minWidth: "45%",
  },
  statusOptionText: {
    fontSize: SIZES.small,
  },
  submitButton: {
    marginTop: 24,
  },
})

export default AdminFlightFormScreen
