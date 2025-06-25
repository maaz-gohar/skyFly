"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
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
import { deleteFlight, getAllFlights } from "../../../api/admin"
import Card from "../../../components/Card"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"
import type { Flight, ScreenNavigationProp } from "../../../types"

interface AdminFlightsScreenProps {
  navigation: ScreenNavigationProp<"Admin">
}

const AdminFlightsScreen: React.FC<AdminFlightsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()
  const [flights, setFlights] = useState<Flight[]>([])
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchFlights()
  }, [])

  useEffect(() => {
    filterFlights()
  }, [searchQuery, filterStatus, flights])

  const fetchFlights = async () => {
    try {
      setLoading(true)
      const flightData = await getAllFlights()
      setFlights(flightData)
      setFilteredFlights(flightData)
    } catch (error) {
      console.error("Error fetching flights:", error)
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to load flights")
    } finally {
      setLoading(false)
    }
  }

  const filterFlights = () => {
    let result = [...flights]

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (flight) =>
          flight.flightNumber.toLowerCase().includes(query) ||
          flight.airline.toLowerCase().includes(query) ||
          flight.origin.toLowerCase().includes(query) ||
          flight.destination.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (filterStatus) {
      result = result.filter((flight) => flight.status === filterStatus)
    }

    setFilteredFlights(result)
  }

  const handleAddFlight = () => {
    navigation.navigate("AdminFlightForm")
  }

  const handleEditFlight = (flight: Flight) => {
    navigation.navigate("AdminFlightForm", { flight })
  }

  const handleDeleteFlight = async (id: string) => {
    Alert.alert("Delete Flight", "Are you sure you want to delete this flight?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFlight(id)
            Alert.alert("Success", "Flight deleted successfully")
            fetchFlights() // Refresh the list
          } catch (error) {
            Alert.alert("Error", error instanceof Error ? error.message : "Failed to delete flight")
          }
        },
      },
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return theme.primary
      case "delayed":
        return theme.secondary
      case "cancelled":
        return theme.error
      case "completed":
        return theme.success
      default:
        return theme.gray
    }
  }

  const renderFlightItem = ({ item }: { item: Flight }) => (
    <Card style={[styles.flightCard, { backgroundColor: theme.white }]}>
      <View style={styles.flightHeader}>
        <View style={styles.flightInfo}>
          <Text style={[styles.flightNumber, { color: theme.black }]}>{item.flightNumber}</Text>
          <Text style={[styles.airline, { color: theme.gray }]}>{item.airline}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.flightRoute}>
        <View style={styles.routePoint}>
          <Text style={[styles.routeCity, { color: theme.black }]}>{item.origin}</Text>
        </View>
        <View style={styles.routeLine}>
          <View style={[styles.line, { backgroundColor: theme.lightGray }]} />
          <Ionicons name="airplane" size={16} color={theme.primary} style={styles.planeIcon} />
        </View>
        <View style={styles.routePoint}>
          <Text style={[styles.routeCity, { color: theme.black }]}>{item.destination}</Text>
        </View>
      </View>

      <View style={styles.flightDetails}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.gray }]}>Departure</Text>
          <Text style={[styles.detailValue, { color: theme.black }]}>
            {new Date(item.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
          <Text style={[styles.detailDate, { color: theme.gray }]}>
            {new Date(item.departureTime).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.gray }]}>Price</Text>
          <Text style={[styles.detailValue, { color: theme.black }]}>${item.price}</Text>
          <Text style={[styles.detailDate, { color: theme.gray }]}>USD</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.gray }]}>Seats</Text>
          <Text style={[styles.detailValue, { color: theme.black }]}>{item.availableSeats}</Text>
          <Text style={[styles.detailDate, { color: theme.gray }]}>Available</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: `${theme.primary}20` }]}
          onPress={() => handleEditFlight(item)}
        >
          <Ionicons name="create-outline" size={16} color={theme.primary} />
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: `${theme.error}20` }]}
          onPress={() => handleDeleteFlight(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color={theme.error} />
          <Text style={[styles.actionButtonText, { color: theme.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.background === COLORS.background ? "dark" : "light"} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.black }]}>Manage Flights</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={handleAddFlight}>
          <Ionicons name="add" size={24} color={theme.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.white, borderColor: theme.lightGray }]}>
          <Ionicons name="search" size={20} color={theme.gray} />
          <TextInput
            style={[styles.searchInput, { color: theme.black }]}
            placeholder="Search flights..."
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
          {["All", "scheduled", "delayed", "cancelled", "completed"].map((status) => (
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
          <Text style={[styles.loadingText, { color: theme.gray }]}>Loading flights...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFlights}
          renderItem={renderFlightItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flightsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="airplane-outline" size={64} color={theme.gray} />
              <Text style={[styles.emptyText, { color: theme.gray }]}>No flights found</Text>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 12,
  },
  flightInfo: {
    flex: 1,
  },
  flightNumber: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
  },
  airline: {
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
  flightDetails: {
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
  detailDate: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
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

export default AdminFlightsScreen
