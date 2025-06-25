"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { cancelBooking, getUserBookings } from "../../api/bookings"
import Button from "../../components/Button"
import Card from "../../components/Card"
import { COLORS, FONTS, SIZES } from "../../constants/theme"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import type { Booking, ScreenNavigationProp } from "../../types"

interface MyBookingsScreenProps {
  navigation: ScreenNavigationProp<"MyBookings">
}

const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()
  const { user, isAuthenticated, token } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<"all" | "upcoming" | "past" | "cancelled">("all")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("🔍 MyBookingsScreen mounted")
    console.log("👤 User:", user)
    console.log("🔑 Token:", token ? "Present" : "Missing")
    console.log("🔐 Authenticated:", isAuthenticated)

    if (isAuthenticated && user) {
      fetchBookings()
    } else {
      console.warn("⚠️ User not authenticated, redirecting to login")
      setLoading(false)
      setError("Please log in to view your bookings")
    }
  }, [isAuthenticated, user])

  const fetchBookings = async () => {
    try {
      console.log("📡 Fetching bookings...")
      setLoading(true)
      setError(null)

      const userBookings = await getUserBookings()
      console.log("✅ Bookings fetched:", userBookings)

      setBookings(userBookings)
    } catch (error) {
      console.error("❌ Failed to fetch bookings:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch bookings"
      setError(errorMessage)

      // If authentication error, show login prompt
      if (errorMessage.includes("Authentication") || errorMessage.includes("401")) {
        Alert.alert("Authentication Required", "Please log in again to view your bookings.", [
          {
            text: "Go to Login",
            onPress: () => navigation.navigate("Login"),
          },
        ])
      } else {
        Alert.alert("Error", errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchBookings()
    setRefreshing(false)
  }

  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking? This action cannot be undone.", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("❌ Cancelling booking:", bookingId)
            await cancelBooking(bookingId)
            Alert.alert("Success", "Booking cancelled successfully")
            fetchBookings() // Refresh the list
          } catch (error) {
            console.error("❌ Cancel booking error:", error)
            Alert.alert("Error", error instanceof Error ? error.message : "Failed to cancel booking")
          }
        },
      },
    ])
  }

  const getFilteredBookings = () => {
    const now = new Date()

    switch (filter) {
      case "upcoming":
        return bookings.filter(
          (booking) => new Date(booking.flight.departureTime) > now && booking.status !== "Cancelled",
        )
      case "past":
        return bookings.filter(
          (booking) => new Date(booking.flight.departureTime) < now || booking.status === "Completed",
        )
      case "cancelled":
        return bookings.filter((booking) => booking.status === "Cancelled")
      default:
        return bookings
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return theme.success || "#10B981"
      case "pending":
        return theme.warning || "#F59E0B"
      case "cancelled":
        return theme.error || "#EF4444"
      case "completed":
        return theme.primary
      default:
        return theme.gray
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <Card style={[styles.bookingCard, { backgroundColor: theme.white }]}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <Text style={[styles.bookingId, { color: theme.black }]}>#{item.id.slice(-6)}</Text>
          <Text style={[styles.flightNumber, { color: theme.gray }]}>{item.flight.flightNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.flightRoute}>
        <View style={styles.routePoint}>
          <Text style={[styles.routeCity, { color: theme.black }]}>{item.flight.origin}</Text>
          <Text style={[styles.routeTime, { color: theme.gray }]}>{formatTime(item.flight.departureTime)}</Text>
        </View>

        <View style={styles.routeLine}>
          <View style={[styles.line, { backgroundColor: theme.lightGray }]} />
          <Ionicons name="airplane" size={16} color={theme.primary} style={styles.planeIcon} />
        </View>

        <View style={styles.routePoint}>
          <Text style={[styles.routeCity, { color: theme.black }]}>{item.flight.destination}</Text>
          <Text style={[styles.routeTime, { color: theme.gray }]}>{formatTime(item.flight.arrivalTime)}</Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.gray} />
          <Text style={[styles.detailText, { color: theme.black }]}>{formatDate(item.flight.departureTime)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color={theme.gray} />
          <Text style={[styles.detailText, { color: theme.black }]}>
            {item.passengers.length} passenger{item.passengers.length > 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="card-outline" size={16} color={theme.gray} />
          <Text style={[styles.detailText, { color: theme.black }]}>${item.totalAmount}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: `${theme.primary}20` }]}
          onPress={() =>
            navigation.navigate("FlightDetails", {
              flight: item.flight,
              booking: item,
            })
          }
        >
          <Ionicons name="eye-outline" size={16} color={theme.primary} />
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>View Details</Text>
        </TouchableOpacity>

        {item.status.toLowerCase() === "confirmed" && new Date(item.flight.departureTime) > new Date() && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${theme.error || "#EF4444"}20` }]}
            onPress={() => handleCancelBooking(item.id)}
          >
            <Ionicons name="close-outline" size={16} color={theme.error || "#EF4444"} />
            <Text style={[styles.actionButtonText, { color: theme.error || "#EF4444" }]}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  )

  const filteredBookings = getFilteredBookings()

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
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
          <Text style={[styles.headerTitle, { color: theme.black }]}>My Bookings</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.authPrompt}>
          <Ionicons name="lock-closed-outline" size={64} color={theme.gray} />
          <Text style={[styles.authPromptTitle, { color: theme.black }]}>Authentication Required</Text>
          <Text style={[styles.authPromptText, { color: theme.gray }]}>Please log in to view your bookings</Text>
          <Button title="Go to Login" onPress={() => navigation.navigate("Login")} style={styles.authPromptButton} />
        </View>
      </SafeAreaView>
    )
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
        <Text style={[styles.headerTitle, { color: theme.black }]}>My Bookings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {[
          { key: "all", label: "All" },
          { key: "upcoming", label: "Upcoming" },
          { key: "past", label: "Past" },
          { key: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterTab,
              {
                backgroundColor: filter === tab.key ? theme.primary : "transparent",
                borderBottomColor: filter === tab.key ? theme.primary : "transparent",
              },
            ]}
            onPress={() => setFilter(tab.key as any)}
          >
            <Text
              style={[
                styles.filterTabText,
                {
                  color: filter === tab.key ? theme.white : theme.gray,
                  fontFamily: filter === tab.key ? FONTS.semiBold : FONTS.regular,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.error || "#EF4444"} />
          <Text style={[styles.errorText, { color: theme.error || "#EF4444" }]}>{error}</Text>
          <Button title="Retry" onPress={fetchBookings} style={styles.retryButton} />
        </View>
      )}

      {/* Loading State */}
      {loading && !error && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.gray }]}>Loading bookings...</Text>
        </View>
      )}

      {/* Bookings List */}
      {!loading && !error && (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.bookingsList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={theme.gray} />
              <Text style={[styles.emptyText, { color: theme.gray }]}>No bookings found</Text>
              <Text style={[styles.emptySubtext, { color: theme.gray }]}>
                {filter === "all" ? "You haven't made any bookings yet" : `No ${filter} bookings found`}
              </Text>
              <Button title="Search Flights" onPress={() => navigation.navigate("Home")} style={styles.searchButton} />
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
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  filterTabText: {
    fontSize: SIZES.small,
  },
  bookingsList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  bookingCard: {
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingId: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
  },
  flightNumber: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  flightRoute: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  routePoint: {
    flex: 1,
    alignItems: "center",
  },
  routeCity: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
    marginBottom: 4,
  },
  routeTime: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
  },
  routeLine: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  line: {
    flex: 1,
    height: 1,
  },
  planeIcon: {
    position: "absolute",
    left: "50%",
    marginLeft: -8,
    transform: [{ rotate: "90deg" }],
  },
  bookingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginLeft: 4,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    marginTop: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 32,
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
  searchButton: {
    marginTop: 16,
    paddingHorizontal: 32,
  },
  authPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  authPromptTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    marginTop: 16,
  },
  authPromptText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    marginTop: 8,
    textAlign: "center",
  },
  authPromptButton: {
    marginTop: 24,
    paddingHorizontal: 32,
  },
})

export default MyBookingsScreen
