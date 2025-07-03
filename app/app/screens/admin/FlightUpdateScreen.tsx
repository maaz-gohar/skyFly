"use client"

import { Ionicons } from "@expo/vector-icons"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { updateFlight } from "../../../api/admin"
import Input from "../../../components/Input"
import { FONTS, SIZES } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"
import type { Flight, ScreenRouteProp } from "../../../types"

interface FlightUpdateScreenProps {
  route: ScreenRouteProp<"UpdateForm">
  navigation: any
}

const FlightUpdateScreen: React.FC<FlightUpdateScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme()
  const { flight } = route.params as { flight: Flight }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      flightNumber: "",
      airline: "",
      origin: "",
      destination: "",
      departureTime: "",
      price: "",
      availableSeats: "",
      status: "",
    },
  })

  useEffect(() => {
    if (flight) {
      setValue("flightNumber", flight.flightNumber)
      setValue("airline", flight.airline)
      setValue("origin", flight.origin)
      setValue("destination", flight.destination)
      setValue("departureTime", new Date(flight.departureTime).toISOString().slice(0, 16))
      setValue("price", String(flight.price))
      setValue("availableSeats", String(flight.availableSeats))
      setValue("status", flight.status)
    }
  }, [flight])

  const onSubmit = async (data: any) => {
    try {
      const updated = await updateFlight(flight._id, {
        ...data,
        price: parseFloat(data.price),
        availableSeats: parseInt(data.availableSeats),
        departureTime: new Date(data.departureTime).toISOString(),
      })

      if (updated.success) {
        Alert.alert("Success", "Flight updated successfully")
        navigation.goBack()
      } else {
        Alert.alert("Error", updated.message || "Update failed")
      }
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Something went wrong while updating flight")
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.black }]}>Update Flight</Text>

        <Input name="flightNumber" label="Flight Number" control={control} rules={{ required: "Required" }} />
        <Input name="airline" label="Airline" control={control} rules={{ required: "Required" }} />
        <Input name="origin" label="Origin" control={control} rules={{ required: "Required" }} />
        <Input name="destination" label="Destination" control={control} rules={{ required: "Required" }} />
        <Input
          name="departureTime"
          label="Departure Time"
          control={control}
          rules={{ required: "Required" }}
          placeholder="YYYY-MM-DDTHH:mm"
        />
        <Input
          name="price"
          label="Price"
          control={control}
          keyboardType="numeric"
          rules={{ required: "Required" }}
        />
        <Input
          name="availableSeats"
          label="Available Seats"
          control={control}
          keyboardType="numeric"
          rules={{ required: "Required" }}
        />
        <Input name="status" label="Status" control={control} rules={{ required: "Required" }} />

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit(onSubmit)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={theme.white} />
          <Text style={[styles.submitButtonText, { color: theme.white }]}>Update Flight</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FlightUpdateScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: SIZES.medium,
  },
  title: {
    fontSize: SIZES.large,
    fontFamily: FONTS.semiBold,
    marginBottom: SIZES.medium,
  },
  submitButton: {
    marginTop: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
    marginLeft: 8,
  },
})
