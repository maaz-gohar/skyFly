"use client"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import type React from "react"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getAllBookings, updateBookingStatus } from "../../../api/admin"
import Card from "../../../components/Card"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"
import type { Booking } from "../../../types"

const AdminBookingsScreen: React.FC = () => {
  const { theme } = useTheme()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [searchQuery, filterStatus, bookings])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const bookingResponse = await getAllBookings()

      if (bookingResponse.success && Array.isArray(bookingResponse.data.bookings)) {
        setBookings(bookingResponse.data.bookings)
        setFilteredBookings(bookingResponse.data.bookings)
      } else {
        Alert.alert("Error", "Invalid bookings data received from server")
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let result = [...bookings]
    const query = searchQuery.trim().toLowerCase()

    if (query) {
      result = result.filter(
        (booking) =>
          booking._id.toLowerCase().includes(query) ||
          booking.flightId?.flightNumber?.toLowerCase().includes(query) ||
          booking.passengers.toString().includes(query) ||
          booking.flightId?.origin?.toLowerCase().includes(query) ||
          booking.flightId?.destination?.toLowerCase().includes(query)
      )
    }

    if (filterStatus) {
      result = result.filter(
        (booking) => booking.status.toLowerCase() === filterStatus.toLowerCase()
      )
    }

    setFilteredBookings(result)
  }

  const handleViewBooking = (booking: Booking) => {
    Alert.alert("View Booking", `Booking details for ${booking._id}`, [{ text: "OK" }])
  }

  const handleUpdateStatus = async (id: string, newStatus: "Confirmed" | "Cancelled" | "Completed" | "Pending") => {
    Alert.alert("Update Status", `Are you sure you want to mark this booking as ${newStatus}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: async () => {
          try {
            await updateBookingStatus(id, newStatus)
            Alert.alert("Success", "Booking status updated successfully")
            fetchBookings()
          } catch (error) {
            Alert.alert("Error", error instanceof Error ? error.message : "Failed to update booking status")
          }
        },
      },
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return theme.primary
      case "Pending":
        return theme.secondary
      case "Cancelled":
        return theme.error
      case "Completed":
        return theme.success
      default:
        return theme.gray
    }
  }

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <Card style={[styles.bookingCard, { backgroundColor: theme.white }]}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
            <Text style={[styles.bookingReference, { color: theme.black }]}>
            #{item._id.slice(-10)}
            </Text>
          <Text style={[styles.flightNumber, { color: theme.gray }]}>Flight: {item.flightId.flightNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.flightRoute}>
        <View style={styles.routePoint}>
          <Text style={[styles.routeCity, { color: theme.black }]}>{item.flightId.origin}</Text>
        </View>
        <View style={styles.routeLine}>
          <View style={[styles.line, { backgroundColor: theme.lightGray }]} />
          <Ionicons name="airplane" size={16} color={theme.primary} style={styles.planeIcon} />
        </View>
        <View style={styles.routePoint}>
          <Text style={[styles.routeCity, { color: theme.black }]}>{item.flightId.destination}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: `${theme.primary}20` }]}
          onPress={() => handleViewBooking(item)}
        >
          <Ionicons name="eye-outline" size={16} color={theme.primary} />
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>View</Text>
        </TouchableOpacity>

        {item.status === "Pending" && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${theme.success}20` }]}
            onPress={() => handleUpdateStatus(item._id, "Confirmed")}
          >
            <Ionicons name="checkmark-outline" size={16} color={theme.success} />
            <Text style={[styles.actionButtonText, { color: theme.success }]}>Confirm</Text>
          </TouchableOpacity>
        )}

        {(item.status === "Pending" || item.status === "Confirmed") && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${theme.error}20` }]}
            onPress={() => handleUpdateStatus(item._id, "Cancelled")}
          >
            <Ionicons name="close-outline" size={16} color={theme.error} />
            <Text style={[styles.actionButtonText, { color: theme.error }]}>Cancel</Text>
          </TouchableOpacity>
        )}

        {item.status === "Confirmed" && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${theme.success}20` }]}
            onPress={() => handleUpdateStatus(item._id, "Completed")}
          >
            <Ionicons name="checkmark-done-outline" size={16} color={theme.success} />
            <Text style={[styles.actionButtonText, { color: theme.success }]}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.background === COLORS.background ? "dark" : "light"} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.black }]}>Manage Bookings</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.white, borderColor: theme.lightGray }]}>
          <Ionicons name="search" size={20} color={theme.gray} />
          <TextInput
            style={[styles.searchInput, { color: theme.black }]}
            placeholder="Search bookings..."
            placeholderTextColor={theme.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.gray} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {["All", "pending", "confirmed", "cancelled", "completed"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    (status === "All" && filterStatus === null) || filterStatus === status
                      ? theme.primary
                      : `${theme.primary}20`,
                },
              ]}
              onPress={() => setFilterStatus(status === "All" ? null : status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      (status === "All" && filterStatus === null) || filterStatus === status
                        ? theme.white
                        : theme.primary,
                  },
                ]}
              >
                {status === "All" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.gray }]}>Loading bookings...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.bookingsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={theme.gray} />
              <Text style={[styles.emptyText, { color: theme.gray }]}>No bookings found</Text>
              <Text style={[styles.emptySubtext, { color: theme.gray }]}>Try adjusting your search or filters</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.extraLarge,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 8,
    flexDirection: "row",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontFamily: FONTS.medium,
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
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingReference: {
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
  passengerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  passengerName: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    marginLeft: 8,
    flex: 1,
  },
  passengerCount: {
    fontFamily: FONTS.regular,
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
    marginBottom: 2,
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
    flex: 1,
    alignItems: "center",
  },
  detailLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
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
  },
})

export default AdminBookingsScreen
