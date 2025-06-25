"use client"

import type React from "react"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getFlights, searchFlights } from "../../api/flights"
import { FONTS, SIZES } from "../../constants/theme"
import { useTheme } from "../../context/ThemeContext"

const DebugScreen: React.FC = () => {
  const { theme } = useTheme()
  const [response, setResponse] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testGetFlights = async () => {
    try {
      setLoading(true)
      setResponse("Testing GET /flights...")

      const flights = await getFlights()
      setResponse(JSON.stringify(flights, null, 2))
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const testSearchFlights = async () => {
    try {
      setLoading(true)
      setResponse("Testing flight search...")

      const flights = await searchFlights({
        from: "NYC",
        to: "LAX",
        departureDate: "2024-01-15",
        passengers: 1,
        class: "Economy",
      })
      setResponse(JSON.stringify(flights, null, 2))
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const testDirectAPI = async () => {
    try {
      setLoading(true)
      setResponse("Testing direct API call...")

      const response = await fetch("http://localhost:5000/api/flights")
      const text = await response.text()

      setResponse(`Status: ${response.status}\nResponse: ${text}`)
    } catch (error) {
      setResponse(`Direct API Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.black }]}>API Debug Screen</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={testGetFlights}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>Test Get Flights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.secondary }]}
          onPress={testSearchFlights}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>Test Search Flights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.success }]}
          onPress={testDirectAPI}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>Test Direct API</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.responseContainer}>
        <Text style={[styles.responseText, { color: theme.black }]}>
          {loading ? "Loading..." : response || "No response yet"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
  },
  responseContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
  },
  responseText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    lineHeight: 20,
  },
})

export default DebugScreen
