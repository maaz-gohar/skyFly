"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DateTimePicker from "@react-native-community/datetimepicker"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getUserBookings } from "../../api/bookings"
import { searchFlights } from "../../api/flights"
import Button from "../../components/Button"
import Card from "../../components/Card"
import { COLORS, FONTS, SIZES } from "../../constants/theme"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import type { Booking, ScreenNavigationProp } from "../../types"


interface HomeScreenProps {
  navigation: ScreenNavigationProp<"Home">
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()
  const { user } = useAuth()

const flightClasses = [
  { label: 'Economy', value: 'Economy' },
  { label: 'Business', value: 'Business' },
  { label: 'First', value: 'First' },
];


  // Search form state
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departureDate, setDepartureDate] = useState(new Date())
  const [returnDate, setReturnDate] = useState<Date | null>(null)
  const [passengers, setPassengers] = useState(1)
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way")
const [flightClass, setFlightClass] = useState<"Economy" | "Business" | "First">("Economy");
const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false)
  const [showReturnPicker, setShowReturnPicker] = useState(false)

  // Data state
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [popularDestinations, setPopularDestinations] = useState([
    { city: "New York", country: "USA", code: "NYC", image: "🗽" },
    { city: "London", country: "UK", code: "LON", image: "🏰" },
    { city: "Tokyo", country: "Japan", code: "TYO", image: "🗾" },
    { city: "Paris", country: "France", code: "PAR", image: "🗼" },
    { city: "Dubai", country: "UAE", code: "DXB", image: "🏜️" },
    { city: "Sydney", country: "Australia", code: "SYD", image: "🏖️" },
  ])

  const [loading, setLoading] = useState(false)
  const [bookingsLoading, setBookingsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRecentBookings()
    }
  }, [user])

  const fetchRecentBookings = async () => {
    try {
      setBookingsLoading(true)
      const userId = await AsyncStorage.getItem("userId")
      const bookings = await getUserBookings(userId || "")
      setRecentBookings(bookings.slice(0, 3)) // Show only recent 3
    } catch (error) {
      console.error("Failed to fetch recent bookings:", error)
    } finally {
      setBookingsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!from.trim() || !to.trim()) {
      Alert.alert("Error", "Please enter both departure and destination cities")
      return
    }

    if (from.toLowerCase() === to.toLowerCase()) {
      Alert.alert("Error", "Departure and destination cities cannot be the same")
      return
    }

    try {
      setLoading(true)

      const searchParams = {
        from: from.trim(),
        to: to.trim(),
        departureDate: departureDate.toISOString().split("T")[0],
        returnDate: returnDate ? returnDate.toISOString().split("T")[0] : undefined,
        passengers,
        class: flightClass,
      }

      const flights = await searchFlights(searchParams)

      navigation.navigate("FlightResults", {
        flights,
        searchParams,
      })
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to search flights")
    } finally {
      setLoading(false)
    }
  }

  const handleDestinationSelect = (destination: any) => {
    setTo(destination.code)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const renderRecentBooking = (booking: Booking) => (
    <TouchableOpacity
      key={booking.id}
      style={[styles.bookingCard, { backgroundColor: theme.white }]}
      onPress={() =>
        navigation.navigate("FlightDetails", {
          flight: booking.flight,
          booking,
        })
      }
    >
      <View style={styles.bookingHeader}>
        <Text style={[styles.bookingRoute, { color: theme.black }]}>
          {booking.flight.origin} → {booking.flight.destination}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: booking.status === "Confirmed" ? theme.success + "20" : theme.secondary + "20" },
          ]}
        >
          <Text style={[styles.statusText, { color: booking.status === "Confirmed" ? theme.success : theme.secondary }]}>
            {booking.status}
          </Text>
        </View>
      </View>
      <Text style={[styles.bookingDetails, { color: theme.gray }]}>
        {booking.flight.airline} • {booking.flight.flightNumber}
      </Text>
      <Text style={[styles.bookingDate, { color: theme.gray }]}>
        {formatDate(new Date(booking.flight.departureTime))}
      </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.background === COLORS.background ? "dark" : "light"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.gray }]}>
              {user ? `Hello, ${user.name.split(" ")[0]}!` : "Welcome!"}
            </Text>
            <Text style={[styles.title, { color: theme.black }]}>Where to next?</Text>
          </View>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: theme.lightGray }]}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person-outline" size={24} color={theme.black} />
          </TouchableOpacity>
        </View>

        {/* Search Form */}
        <Card style={[styles.searchCard, { backgroundColor: theme.background }]}>
          {/* Trip Type Selector */}
          <View style={[styles.tripTypeContainer, { backgroundColor: theme.lightGray }]}>
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                {
                  backgroundColor: tripType === "one-way" ? theme.primary : "transparent",
                },
              ]}
              onPress={() => setTripType("one-way")}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  {
                    color: tripType === "one-way" ? theme.white : theme.gray,
                  },
                ]}
              >
                One Way
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                {
                  backgroundColor: tripType === "round-trip" ? theme.primary : "transparent",
                },
              ]}
              onPress={() => setTripType("round-trip")}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  {
                    color: tripType === "round-trip" ? theme.white : theme.gray,
                  },
                ]}
              >
                Round Trip
              </Text>
            </TouchableOpacity>
          </View>

          {/* From/To Inputs */}
          <View style={styles.routeContainer}>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.gray }]}>From</Text>
              <TextInput
                style={[styles.input, { color: theme.black, borderColor: theme.lightGray }]}
                value={from}
                onChangeText={setFrom}
                placeholder="Departure city"
                placeholderTextColor={theme.gray}
              />
            </View>

            <TouchableOpacity style={styles.swapButton}>
              <Ionicons name="swap-horizontal" size={24} color={theme.primary} />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.gray }]}>To</Text>
              <TextInput
                style={[styles.input, { color: theme.black, borderColor: theme.lightGray }]}
                value={to}
                onChangeText={setTo}
                placeholder="Destination city"
                placeholderTextColor={theme.gray}
              />
            </View>
          </View>

          {/* Date Inputs */}
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={[styles.dateInput, { borderColor: theme.lightGray }]}
              onPress={() => setShowDeparturePicker(true)}
            >
              <Text style={[styles.inputLabel, { color: theme.gray }]}>Departure</Text>
              <Text style={[styles.dateText, { color: theme.black }]}>{formatDate(departureDate)}</Text>
            </TouchableOpacity>

            {tripType === "round-trip" && (
              <TouchableOpacity
                style={[styles.dateInput, { borderColor: theme.lightGray }]}
                onPress={() => setShowReturnPicker(true)}
              >
                <Text style={[styles.inputLabel, { color: theme.gray }]}>Return</Text>
                <Text style={[styles.dateText, { color: theme.black }]}>
                  {returnDate ? formatDate(returnDate) : "Select date"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Passengers and Class */}
          <View style={styles.optionsContainer}>
            <View style={styles.passengerContainer}>
              <Text style={[styles.inputLabel, { color: theme.gray }]}>Passengers</Text>
              <View style={styles.passengerControls}>
                <TouchableOpacity
                  style={[styles.passengerButton, { backgroundColor: theme.lightGray }]}
                  onPress={() => setPassengers(Math.max(1, passengers - 1))}
                >
                  <Ionicons name="remove" size={16} color={theme.black} />
                </TouchableOpacity>
                <Text style={[styles.passengerCount, { color: theme.black }]}>{passengers}</Text>
                <TouchableOpacity
                  style={[styles.passengerButton, { backgroundColor: theme.lightGray }]}
                  onPress={() => setPassengers(Math.min(9, passengers + 1))}
                >
                  <Ionicons name="add" size={16} color={theme.black} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.classContainer}>
              <Text style={[styles.inputLabel, { color: theme.gray }]}>Class</Text>
              <View style={styles.classContainer}>
  <Text style={[styles.inputLabel, { color: theme.gray }]}>Class</Text>

  <TouchableOpacity
    style={[styles.classSelector, { borderColor: theme.lightGray }]}
    onPress={() => setDropdownVisible(true)}
  >
    <Text style={[styles.classText, { color: theme.black }]}>{flightClass}</Text>
    <Ionicons name="chevron-down" size={16} color={theme.gray} />
  </TouchableOpacity>

  {/* Dropdown Modal */}
  <Modal transparent visible={dropdownVisible} animationType="fade">
    <TouchableOpacity
      style={styles.modalOverlay}
      onPress={() => setDropdownVisible(false)}
      activeOpacity={1}
    >
      <View style={styles.dropdown}>
        {["Economy", "Business", "First"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              setFlightClass(item as typeof flightClass);
              setDropdownVisible(false);
            }}
            style={styles.dropdownItem}
          >
            <Text style={{ color: theme.black }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>
</View>
            </View>
          </View>

          {/* Search Button */}
          <Button
            title={loading ? "Searching..." : "Search Flights"}
            onPress={handleSearch}
            disabled={loading}
            style={styles.searchButton}
          />
        </Card>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.black , paddingHorizontal:25, marginBottom:20}]}>Popular Destinations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.destinationsContainer}>
              {popularDestinations.map((destination, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.destinationCard, { backgroundColor: theme.white }]}
                  onPress={() => handleDestinationSelect(destination)}
                >
                  <Text style={styles.destinationEmoji}>{destination.image}</Text>
                  <Text style={[styles.destinationCity, { color: theme.black }]}>{destination.city}</Text>
                  <Text style={[styles.destinationCountry, { color: theme.gray }]}>{destination.country}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recent Bookings */}
        {user && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.black }]}>Recent Bookings</Text>
              <TouchableOpacity onPress={() => navigation.navigate("MyBookings")}>
                <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>

            {bookingsLoading ? (
              <ActivityIndicator size="small" color={theme.primary} style={styles.loadingIndicator} />
            ) : recentBookings.length > 0 ? (
              <View style={styles.bookingsContainer}>{recentBookings.map(renderRecentBooking)}</View>
            ) : (
              <Card style={[styles.emptyBookings, { backgroundColor: theme.white }]}>
                <Ionicons name="calendar-outline" size={48} color={theme.gray} />
                <Text style={[styles.emptyText, { color: theme.gray }]}>No recent bookings</Text>
                <Text style={[styles.emptySubtext, { color: theme.gray }]}>Start planning your next trip!</Text>
              </Card>
            )}
          </View>
        )}
      </ScrollView>

      {/* Date Pickers */}
      {showDeparturePicker && (
        <DateTimePicker
          value={departureDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDeparturePicker(false)
            if (selectedDate) {
              setDepartureDate(selectedDate)
              // Reset return date if it's before departure date
              if (returnDate && returnDate <= selectedDate) {
                setReturnDate(null)
              }
            }
          }}
        />
      )}

      {showReturnPicker && (
        <DateTimePicker
          value={returnDate || new Date(departureDate.getTime() + 24 * 60 * 60 * 1000)}
          mode="date"
          display="default"
          minimumDate={new Date(departureDate.getTime() + 24 * 60 * 60 * 1000)}
          onChange={(event, selectedDate) => {
            setShowReturnPicker(false)
            if (selectedDate) {
              setReturnDate(selectedDate)
            }
          }}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  greeting: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.extraLarge,
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  searchCard: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  tripTypeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 4,
  },
  tripTypeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  tripTypeText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
  },
  swapButton: {
    marginHorizontal: 12,
    padding: 8,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    marginTop: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  passengerContainer: {
    flex: 1,
  },
  passengerControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  passengerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  passengerCount: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: "center",
  },
  classContainer: {
    flex: 1,
  },
  classSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  classText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
  },
  searchButton: {
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    // paddingHorizontal:25,
    // paddingBottom: 20,
  },
  seeAllText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
  },
  destinationsContainer: {
    flexDirection: "row",
    paddingLeft: 24,
  },
  destinationCard: {
    width: 120,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 12,
    ...COLORS.shadow,
  },
  destinationEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  destinationCity: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
    marginBottom: 4,
  },
  destinationCountry: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
  },
  bookingsContainer: {
    paddingHorizontal: 24,
  },
  bookingCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...COLORS.shadow,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bookingRoute: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  bookingDetails: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginBottom: 4,
  },
  bookingDate: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
  },
  emptyBookings: {
    alignItems: "center",
    paddingVertical: 32,
    marginHorizontal: 24,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    marginTop: 12,
  },
  emptySubtext: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 4,
    textAlign: "center",
  },
  loadingIndicator: {
    paddingVertical: 20,
  },
  
})

export default HomeScreen
