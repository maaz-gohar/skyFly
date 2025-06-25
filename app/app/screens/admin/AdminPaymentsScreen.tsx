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
import Card from "../../../components/Card"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"

interface Payment {
  id: string
  bookingId: string
  userId: string
  userName: string
  amount: number
  currency: string
  status: "completed" | "pending" | "failed" | "refunded"
  paymentMethod: "card" | "paypal" | "bank_transfer"
  transactionId: string
  createdAt: string
  updatedAt: string
  flightDetails: {
    from: string
    to: string
    date: string
  }
}

const AdminPaymentsScreen: React.FC = () => {
  const { theme } = useTheme()
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [searchQuery, filterStatus, payments])

  const fetchPayments = async () => {
    try {
      // Mock data for demonstration
      const mockPayments: Payment[] = [
        {
          id: "1",
          bookingId: "BK001",
          userId: "U001",
          userName: "John Smith",
          amount: 450.0,
          currency: "USD",
          status: "completed",
          paymentMethod: "card",
          transactionId: "TXN001234567",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
          flightDetails: {
            from: "New York",
            to: "Los Angeles",
            date: "2024-02-15",
          },
        },
        {
          id: "2",
          bookingId: "BK002",
          userId: "U002",
          userName: "Sarah Johnson",
          amount: 680.5,
          currency: "USD",
          status: "pending",
          paymentMethod: "paypal",
          transactionId: "TXN001234568",
          createdAt: "2024-01-16T14:20:00Z",
          updatedAt: "2024-01-16T14:20:00Z",
          flightDetails: {
            from: "Chicago",
            to: "Miami",
            date: "2024-02-20",
          },
        },
        {
          id: "3",
          bookingId: "BK003",
          userId: "U003",
          userName: "Michael Brown",
          amount: 320.75,
          currency: "USD",
          status: "failed",
          paymentMethod: "card",
          transactionId: "TXN001234569",
          createdAt: "2024-01-17T09:15:00Z",
          updatedAt: "2024-01-17T09:15:00Z",
          flightDetails: {
            from: "Boston",
            to: "Seattle",
            date: "2024-02-25",
          },
        },
        {
          id: "4",
          bookingId: "BK004",
          userId: "U004",
          userName: "Emily Davis",
          amount: 890.0,
          currency: "USD",
          status: "completed",
          paymentMethod: "bank_transfer",
          transactionId: "TXN001234570",
          createdAt: "2024-01-18T16:45:00Z",
          updatedAt: "2024-01-18T16:45:00Z",
          flightDetails: {
            from: "San Francisco",
            to: "New York",
            date: "2024-03-01",
          },
        },
        {
          id: "5",
          bookingId: "BK005",
          userId: "U005",
          userName: "David Wilson",
          amount: 550.25,
          currency: "USD",
          status: "refunded",
          paymentMethod: "card",
          transactionId: "TXN001234571",
          createdAt: "2024-01-19T11:30:00Z",
          updatedAt: "2024-01-19T11:30:00Z",
          flightDetails: {
            from: "Denver",
            to: "Atlanta",
            date: "2024-03-05",
          },
        },
      ]

      setPayments(mockPayments)
      setFilteredPayments(mockPayments)
    } catch (error) {
      console.error("Error fetching payments:", error)
      Alert.alert("Error", "Failed to load payments")
    } finally {
      setLoading(false)
    }
  }

  const filterPayments = () => {
    let result = [...payments]

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (payment) =>
          payment.userName.toLowerCase().includes(query) ||
          payment.bookingId.toLowerCase().includes(query) ||
          payment.transactionId.toLowerCase().includes(query) ||
          payment.flightDetails.from.toLowerCase().includes(query) ||
          payment.flightDetails.to.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (filterStatus) {
      result = result.filter((payment) => payment.status === filterStatus)
    }

    setFilteredPayments(result)
  }

  const handleViewPayment = (payment: Payment) => {
    Alert.alert(
      "Payment Details",
      `Transaction ID: ${payment.transactionId}\nAmount: $${payment.amount}\nStatus: ${payment.status}\nMethod: ${payment.paymentMethod}`,
      [{ text: "OK" }],
    )
  }

  const handleRefundPayment = (payment: Payment) => {
    if (payment.status !== "completed") {
      Alert.alert("Error", "Only completed payments can be refunded")
      return
    }

    Alert.alert("Refund Payment", `Are you sure you want to refund $${payment.amount} to ${payment.userName}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Refund",
        style: "destructive",
        onPress: () => {
          // In a real app, this would call an API
          setPayments(payments.map((p) => (p.id === payment.id ? { ...p, status: "refunded" as const } : p)))
          Alert.alert("Success", "Payment refunded successfully")
        },
      },
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return theme.success
      case "pending":
        return theme.warning
      case "failed":
        return theme.error
      case "refunded":
        return theme.secondary
      default:
        return theme.gray
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return "card-outline"
      case "paypal":
        return "logo-paypal"
      case "bank_transfer":
        return "business-outline"
      default:
        return "wallet-outline"
    }
  }

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <Card style={[styles.paymentCard, { backgroundColor: theme.white }]}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={[styles.bookingId, { color: theme.black }]}>#{item.bookingId}</Text>
          <Text style={[styles.userName, { color: theme.gray }]}>{item.userName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: theme.black }]}>
          ${item.amount.toFixed(2)} {item.currency}
        </Text>
        <View style={styles.paymentMethodContainer}>
          <Ionicons name={getPaymentMethodIcon(item.paymentMethod) as any} size={16} color={theme.gray} />
          <Text style={[styles.paymentMethod, { color: theme.gray }]}>
            {item.paymentMethod.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.flightDetails}>
        <View style={styles.routeContainer}>
          <Ionicons name="airplane-outline" size={16} color={theme.gray} />
          <Text style={[styles.route, { color: theme.black }]}>
            {item.flightDetails.from} → {item.flightDetails.to}
          </Text>
        </View>
        <Text style={[styles.flightDate, { color: theme.gray }]}>
          {new Date(item.flightDetails.date).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionId, { color: theme.gray }]}>Transaction: {item.transactionId}</Text>
        <Text style={[styles.paymentDate, { color: theme.gray }]}>
          {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: `${theme.primary}20` }]}
          onPress={() => handleViewPayment(item)}
        >
          <Ionicons name="eye-outline" size={16} color={theme.primary} />
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>View</Text>
        </TouchableOpacity>

        {item.status === "completed" && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${theme.error}20` }]}
            onPress={() => handleRefundPayment(item)}
          >
            <Ionicons name="return-down-back-outline" size={16} color={theme.error} />
            <Text style={[styles.actionButtonText, { color: theme.error }]}>Refund</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  )

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => (payment.status === "completed" ? sum + payment.amount : sum),
    0,
  )

  const completedPayments = filteredPayments.filter((p) => p.status === "completed").length
  const pendingPayments = filteredPayments.filter((p) => p.status === "pending").length
  const failedPayments = filteredPayments.filter((p) => p.status === "failed").length

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.background === COLORS.background ? "dark" : "light"} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.black }]}>Payment Management</Text>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.statValue, { color: theme.success }]}>${totalAmount.toFixed(2)}</Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Total Revenue</Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>{completedPayments}</Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Completed</Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.statValue, { color: theme.warning }]}>{pendingPayments}</Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Pending</Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.statValue, { color: theme.error }]}>{failedPayments}</Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Failed</Text>
        </Card>
      </ScrollView>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.white, borderColor: theme.lightGray }]}>
          <Ionicons name="search" size={20} color={theme.gray} />
          <TextInput
            style={[styles.searchInput, { color: theme.black }]}
            placeholder="Search payments..."
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
          {["All", "completed", "pending", "failed", "refunded"].map((status) => (
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
          <Text style={[styles.loadingText, { color: theme.gray }]}>Loading payments...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPayments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.paymentsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="card-outline" size={64} color={theme.gray} />
              <Text style={[styles.emptyText, { color: theme.gray }]}>No payments found</Text>
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
  statsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  statCard: {
    minWidth: 120,
    alignItems: "center",
    paddingVertical: 16,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 4,
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
  paymentsList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  paymentCard: {
    marginBottom: 16,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  bookingId: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
  },
  userName: {
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
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethod: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginLeft: 4,
  },
  flightDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  route: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginLeft: 4,
  },
  flightDate: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
  },
  transactionDetails: {
    marginBottom: 16,
  },
  transactionId: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginBottom: 4,
  },
  paymentDate: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
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
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    marginTop: 8,
    textAlign: "center",
  },
})

export default AdminPaymentsScreen
