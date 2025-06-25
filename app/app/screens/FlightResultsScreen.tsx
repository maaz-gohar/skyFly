"use client"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import type React from "react"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getFlights, searchFlights } from "../../api/flights"
import Card from "../../components/Card"
import { COLORS, FONTS, SIZES } from "../../constants/theme"
import { useTheme } from "../../context/ThemeContext"
import type { Flight, ScreenNavigationProp } from "../../types"

interface FlightResultsScreenProps {
  navigation: ScreenNavigationProp<"FlightResults">
  route: {
    params: {
      flights?: Flight[]
      searchParams: {
        from: string
        to: string
        departureDate: string
        returnDate?: string
        passengers: number
        class: string
      }
    }
  }
}

const FlightResultsScreen: React.FC<FlightResultsScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme()
  const { searchParams } = route.params
  const [flights, setFlights] = useState<Flight[]>(route.params.flights || [])
  const [originalFlights, setOriginalFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(!route.params.flights)
  const [error, setError] = useState<string>("")
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price")

  useEffect(() => {
    if (!route.params.flights) {
      fetchFlights()
    }
  }, [])

  useEffect(() => {
    if (originalFlights.length > 0) {
      sortFlights()
    }
  }, [sortBy, originalFlights])

  const fetchFlights = async () => {
    try {
      setLoading(true)
      setError("")
      console.log("Fetching flights with params:", searchParams)

      let results: Flight[] = []

      // Try search first, then fallback to get all flights
      try {
        results = await searchFlights(searchParams)
        console.log("Search results:", results)
      } catch (searchError) {
        console.log("Search failed, trying get all flights:", searchError)
        results = await getFlights()
        console.log("Get all flights results:", results)
      }

      if (!results || results.length === 0) {
        // Create some mock data for testing if no real data
        results = createMockFlights()
        console.log("Using mock data:", results)
      }

      setOriginalFlights(results)
      setFlights(results)
    } catch (error) {
      console.error("All fetch methods failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch flights"
      setError(errorMessage)

      // Show mock data even on error for testing
      const mockFlights = createMockFlights()
      setOriginalFlights(mockFlights)
      setFlights(mockFlights)

      Alert.alert("Connection Error", `${errorMessage}\n\nShowing sample data for testing.`, [{ text: "OK" }])
    } finally {
      setLoading(false)
    }
  }

  const createMockFlights = (): Flight[] => {
    return [
      {
        id: "1",
        flightNumber: "AA123",
        airline: "American Airlines",
        logo: "https://via.placeholder.com/40x40?text=AA",
        origin: searchParams.from || "NYC",
        destination: searchParams.to || "LAX",
        departureTime: new Date().toISOString(),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
        duration: 300,
        stops: 0,
        price: 299,
        availableSeats: 45,
        class: "Economy",
      },
      {
        id: "2",
        flightNumber: "DL456",
        airline: "Delta Airlines",
        logo: "https://via.placeholder.com/40x40?text=DL",
        origin: searchParams.from || "NYC",
        destination: searchParams.to || "LAX",
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        arrivalTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
        duration: 300,
        stops: 1,
        price: 249,
        availableSeats: 23,
        class: "Economy",
      },
    ]
  }

  const sortFlights = () => {
    const sorted = [...originalFlights].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "duration":
          return a.duration - b.duration
        case "departure":
          return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
        default:
          return 0
      }
    })
    setFlights(sorted)
  }

  const handleFlightSelect = (flight: Flight) => {
    navigation.navigate("FlightDetails", { flight, searchParams })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderFlightItem = ({ item }: { item: Flight }) => (
    <TouchableOpacity onPress={() => handleFlightSelect(item)}>
      <Card style={[styles.flightCard, { backgroundColor: theme.lightGray }]}>
        <View style={styles.flightHeader}>
          <Text style={[styles.airline, { color: theme.black }]}>{item.airline}</Text>
          <Text style={[styles.flightNumber, { color: theme.gray }]}>{item.flightNumber}</Text>
        </View>

        <View style={styles.flightRoute}>
          <View style={styles.routePoint}>
            <Text style={[styles.time, { color: theme.black }]}>{formatTime(item.departureTime)}</Text>
            <Text style={[styles.airport, { color: theme.gray }]}>{item.origin}</Text>
          </View>

          <View style={styles.routeLine}>
            <View style={[styles.line, { backgroundColor: theme.lightGray }]} />
            <View style={styles.flightInfo}>
              <Text style={[styles.duration, { color: theme.gray }]}>{formatDuration(item.duration)}</Text>
              {item.stops > 0 && (
                <Text style={[styles.stops, { color: theme.secondary }]}>
                  {item.stops} stop{item.stops > 1 ? "s" : ""}
                </Text>
              )}
            </View>
            <View style={[styles.line, { backgroundColor: theme.lightGray }]} />
          </View>

          <View style={styles.routePoint}>
            <Text style={[styles.time, { color: theme.black }]}>{formatTime(item.arrivalTime)}</Text>
            <Text style={[styles.airport, { color: theme.gray }]}>{item.destination}</Text>
          </View>
        </View>

        <View style={styles.flightFooter}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.primary }]}>${item.price}</Text>
            <Text style={[styles.priceLabel, { color: theme.gray }]}>per person</Text>
          </View>
          <View style={styles.seatsContainer}>
            <Text style={[styles.seatsAvailable, { color: theme.success }]}>{item.availableSeats} seats left</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
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
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.black }]}>
            {searchParams.from} → {searchParams.to}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.gray }]}>
            {searchParams.departureDate} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.filterContainer}>
        <View style={styles.sortContainer}>
          <Text style={[styles.filterLabel, { color: theme.gray }]}>Sort by:</Text>
          {["price", "duration", "departure"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterButton,
                {
                  backgroundColor: sortBy === option ? theme.primary : theme.lightGray,
                },
              ]}
              onPress={() => setSortBy(option as any)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color: sortBy === option ? theme.white : theme.gray,
                  },
                ]}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={fetchFlights}>
            <Text style={[styles.retryButtonText, { color: theme.white }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.gray }]}>Searching flights...</Text>
        </View>
      ) : (
        <FlatList
          data={flights}
          renderItem={renderFlightItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flightsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="airplane-outline" size={64} color={theme.gray} />
              <Text style={[styles.emptyText, { color: theme.gray }]}>No flights found</Text>
              <Text style={[styles.emptySubtext, { color: theme.gray }]}>Try adjusting your search criteria</Text>
            </View>
          }
        />
      )}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
  },
  headerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  filterContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterButtonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  errorContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryButtonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  flightsList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  flightCard: {
    marginBottom: 16,
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  airline: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
  },
  flightNumber: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
  },
  flightRoute: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  routePoint: {
    alignItems: "center",
    flex: 1,
  },
  time: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
  },
  airport: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  routeLine: {
    flex: 2,
    alignItems: "center",
    position: "relative",
  },
  line: {
    height: 1,
    flex: 1,
  },
  flightInfo: {
    position: "absolute",
    alignItems: "center",
  },
  duration: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  stops: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  flightFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    alignItems: "flex-start",
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
  },
  priceLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
  },
  seatsContainer: {
    alignItems: "flex-end",
  },
  seatsAvailable: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 64,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 8,
    textAlign: "center",
  },
})

export default FlightResultsScreen
