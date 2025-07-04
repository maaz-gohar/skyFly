"use client"

import { updateFlight } from "@/api/admin"
import { Ionicons } from "@expo/vector-icons"
import type { StackScreenProps } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import moment from "moment"
import React, { useEffect, useState } from "react"
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Button from "../../../components/Button"
import Input from "../../../components/Input"
import { COLORS, FONTS } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"
import type { RootStackParamList } from "../../_layout"

type Props = StackScreenProps<RootStackParamList, "UpdateForm">

const FlightUpdateScreen: React.FC<Props> = ({ route, navigation }) => {
  const { theme } = useTheme()
  const { flight } = route.params

  const [formData, setFormData] = useState({
    airline: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    duration: "",
    status: "scheduled",
  })

  const [loading, setLoading] = useState(false)

  const isCustomDateFormat = (value: string) => {
    const regex = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/
    return regex.test(value)
  }

  useEffect(() => {
    if (flight) {
      setFormData({
        airline: flight.airline || "",
        from: flight.origin || "", // mapped from backend
        to: flight.destination || "", // mapped from backend
        departureTime: moment(flight.departureTime).format("DD-MM-YYYY HH:mm"),
        arrivalTime: moment(flight.arrivalTime).format("DD-MM-YYYY HH:mm"),
        price: String(flight.price || ""),
        duration: flight.duration || "",
        status: flight.status || "scheduled",
      })
    }
  }, [flight])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdate = async () => {
    const {
      airline,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      duration,
      status,
    } = formData

    try {
      if (!isCustomDateFormat(departureTime) || !isCustomDateFormat(arrivalTime)) {
        Alert.alert("Error", "Please use format: DD-MM-YYYY HH:mm (e.g. 10-08-2025 12:00)")
        return
      }

      const parsedDeparture = moment(departureTime, "DD-MM-YYYY HH:mm", true)
      const parsedArrival = moment(arrivalTime, "DD-MM-YYYY HH:mm", true)

      if (!parsedDeparture.isValid() || !parsedArrival.isValid()) {
        Alert.alert("Error", "Invalid date value. Make sure date is in 'DD-MM-YYYY HH:mm' format")
        return
      }

      setLoading(true)

      await updateFlight(flight._id, {
        airline,
        origin: from,
        destination: to,
        departureTime: parsedDeparture.toISOString(),
        arrivalTime: parsedArrival.toISOString(),
        price: Number(price),
        duration,
        status,
      })

      Alert.alert("Success", "Flight updated successfully")
      navigation.goBack()
    } catch (error: any) {
      console.error("Update Error:", error)
      Alert.alert("Update Failed", error?.message || "Something went wrong.")
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
        <Text style={[styles.headerTitle, { color: theme.black }]}>Update Flight</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Input
            label="Airline"
            placeholder="Enter airline"
            value={formData.airline}
            onChangeText={(text) => handleInputChange("airline", text)}
            icon="airplane-outline"
          />

          <Input
            label="From"
            placeholder="Departure city"
            value={formData.from}
            onChangeText={(text) => handleInputChange("from", text)}
            icon="location-outline"
          />

          <Input
            label="To"
            placeholder="Arrival city"
            value={formData.to}
            onChangeText={(text) => handleInputChange("to", text)}
            icon="location-outline"
          />

          <Input
            label="Departure Time"
            placeholder="e.g. 15-08-2025 08:00"
            value={formData.departureTime}
            onChangeText={(text) => handleInputChange("departureTime", text)}
            icon="time-outline"
          />

          <Input
            label="Arrival Time"
            placeholder="e.g. 15-08-2025 12:00"
            value={formData.arrivalTime}
            onChangeText={(text) => handleInputChange("arrivalTime", text)}
            icon="time-outline"
          />

          <Input
            label="Price"
            placeholder="Enter price"
            value={formData.price}
            onChangeText={(text) => handleInputChange("price", text)}
            icon="pricetag-outline"
            keyboardType="numeric"
          />

          <Input
            label="Duration"
            placeholder="e.g. 2h 30m"
            value={formData.duration}
            onChangeText={(text) => handleInputChange("duration", text)}
            icon="timer-outline"
          />

          {/* STATUS OPTIONS */}
          <View style={styles.statusContainer}>
            <Text style={[styles.statusLabel, { color: theme.black }]}>Status</Text>
            <View style={styles.statusOptions}>
              {["scheduled", "delayed", "cancelled", "completed"].map((statusOption) => (
                <TouchableOpacity
                  key={statusOption}
                  style={[
                    styles.statusOption,
                    {
                      backgroundColor:
                        formData.status === statusOption ? theme.primary : theme.lightGray,
                      borderColor:
                        formData.status === statusOption ? theme.primary : "transparent",
                    },
                  ]}
                  onPress={() => handleInputChange("status", statusOption)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      {
                        color:
                          formData.status === statusOption ? theme.white : theme.gray,
                        fontFamily:
                          formData.status === statusOption
                            ? FONTS.semiBold
                            : FONTS.regular,
                      },
                    ]}
                  >
                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button
            title="Update Flight"
            onPress={handleUpdate}
            gradient
            loading={loading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FlightUpdateScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: "space-between",
  },
  backButton: {
    borderRadius: 10,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  saveButton: {
    marginTop: 20,
  },
  statusContainer: {
    marginTop: 15,
  },
  statusLabel: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    marginBottom: 10,
  },
  statusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusOptionText: {
    fontSize: 14,
  },
})
