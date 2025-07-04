"use client";

import type React from "react";

import { getAllPayments } from "@/api/admin";
import { AdminPayment } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../components/Card";
import { COLORS, FONTS, SIZES } from "../../../constants/theme";
import { useTheme } from "../../../context/ThemeContext";



const AdminPaymentsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchQuery, filterStatus, payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const paymentData = await getAllPayments();
      if (paymentData.success && Array.isArray(paymentData.data.payments)) {
        setPayments(paymentData.data.payments);
        setFilteredPayments(paymentData.data.payments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      Alert.alert("Error", "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let result = [...payments];
    const query = searchQuery.toLowerCase();

    if (searchQuery) {
      result = result.filter((payment) => {
        const userName = payment.bookingId.userId.name.toLowerCase();
        const bookingId = payment.bookingId._id.toLowerCase();
        const transactionId = (payment.transactionId || "").toLowerCase();
        const airline = payment.bookingId.flightId.airline.toLowerCase();
        const flightNumber =
          payment.bookingId.flightId.flightNumber.toLowerCase();
        return (
          userName.includes(query) ||
          bookingId.includes(query) ||
          transactionId.includes(query) ||
          airline.includes(query) ||
          flightNumber.includes(query)
        );
      });
    }

    if (filterStatus) {
      result = result.filter(
        (payment) => payment.paymentStatus.toLowerCase() === filterStatus
      );
    }

    setFilteredPayments(result);
  };

  const handleViewPayment = (payment: AdminPayment) => {
    Alert.alert(
      "Payment Details",
      `Transaction ID: ${payment.transactionId}\nAmount: $${payment.amount}\nStatus: ${payment.paymentStatus}\nMethod: ${payment.paymentMethod}`,
      [{ text: "OK" }]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return theme.success;
      default:
        return theme.gray;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
      case "debit card":
        return "card-outline";
      case "paypal":
        return "logo-paypal";
      case "bank transfer":
        return "business-outline";
      default:
        return "wallet-outline";
    }
  };

  const renderPaymentItem = ({ item }: { item: AdminPayment }) => (
    <Card style={[styles.paymentCard, { backgroundColor: theme.white }]}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={[styles.bookingId, { color: theme.black }]}>
            #{item.bookingId._id}
          </Text>
          <Text style={[styles.userName, { color: theme.gray }]}>
            {item.bookingId.userId.name}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.paymentStatus)}20` },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.paymentStatus) },
            ]}
          >
            {item.paymentStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: theme.black }]}>
          ${item.amount.toFixed(2)}
        </Text>
        <View style={styles.paymentMethodContainer}>
          <Ionicons
            name={getPaymentMethodIcon(item.paymentMethod) as any}
            size={16}
            color={theme.gray}
          />
          <Text style={[styles.paymentMethod, { color: theme.gray }]}>
            {item.paymentMethod.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionId, { color: theme.gray }]}>
          Transaction: {item.transactionId || "N/A"}
        </Text>
        <Text style={[styles.paymentDate, { color: theme.gray }]}>
          {new Date(item.createdAt).toLocaleDateString()} at{" "}
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: `${theme.primary}20` },
          ]}
          onPress={() => handleViewPayment(item)}
        >
          <Ionicons name="eye-outline" size={16} color={theme.primary} />
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>
            View
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const totalAmount = filteredPayments.reduce(
    (sum, payment) =>
      payment.paymentStatus.toLowerCase() === "completed"
        ? sum + payment.amount
        : sum,
    0
  );

  const completedPayments = filteredPayments.filter(
    (p) => p.paymentStatus.toLowerCase() === "completed"
  ).length;
  const pendingPayments = filteredPayments.filter(
    (p) => p.paymentStatus.toLowerCase() === "pending"
  ).length;
  const failedPayments = filteredPayments.filter(
    (p) => p.paymentStatus.toLowerCase() === "failed"
  ).length;

  return (
    <SafeAreaView
      style={[styles.container,{ backgroundColor: theme.background }]}
    >
      <StatusBar
        style={theme.background === COLORS.background ? "dark" : "light"}
      />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.black }]}>
          Payment Management
        </Text>
      </View>

      {/* Stats Cards */}
            <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            { backgroundColor: theme.white, borderColor: theme.lightGray },
          ]}
        >
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
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsContainer}
      >
        <Card style={[styles.statCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.statValue, { color: theme.success }]}>
            ${totalAmount.toFixed(2)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>
            Total Revenue
          </Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {completedPayments}
          </Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>
            Completed
          </Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.statValue, { color: theme.secondary }]}>
            {pendingPayments}
          </Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Pending</Text>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.statValue, { color: theme.error }]}>
            {failedPayments}
          </Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Failed</Text>
        </Card>
      </ScrollView>


      <FlatList
        data={filteredPayments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.paymentsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={64} color={theme.gray} />
            <Text style={[styles.emptyText, { color: theme.gray }]}>
              No payments found
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.gray }]}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    // marginBottom:90
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
    // paddingVertical: 16,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    // height: 120,
  },

  statCard: {
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: 16,
    height:"60%",
  },

  statValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    marginTop: 8,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 8,
  },
  searchContainer: {
    paddingHorizontal: 24,
    // marginBottom: 16,
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
});

export default AdminPaymentsScreen;
