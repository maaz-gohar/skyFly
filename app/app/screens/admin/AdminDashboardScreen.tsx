"use client";

import type React from "react";

import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDashboardStats } from "../../../api/admin";
import Card from "../../../components/Card";
import { COLORS, FONTS, SIZES } from "../../../constants/theme";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import type { DashboardStats, ScreenNavigationProp } from "../../../types";

const { width } = Dimensions.get("window");

interface AdminDashboardScreenProps {
  navigation: ScreenNavigationProp<"Dashboard">;
}

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  navigation,
}) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalFlights: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentBookings: 0,
    activeFlights: 0,
    monthlyRevenue: [],
    bookingsByStatus: [],
    topDestinations: [],
    activeUsers: 0, // Initialize activeUsers
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      console.log("📊 Fetching dashboard stats...");
      const response = await getDashboardStats();
      console.log("✅ Dashboard stats:", response);

      // Use response.data instead of entire response
      setStats(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch dashboard stats:", error);
      // fallback mock data
      setStats({
        totalFlights: 1250,
        totalBookings: 8945,
        totalUsers: 15420,
        totalRevenue: 2450000,
        recentBookings: 156,
        activeFlights: 89,
        monthlyRevenue: [],
        bookingsByStatus: [],
        topDestinations: [],
        activeUsers: 12000, // Mock active users
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            // Navigation will be handled by auth state change
          } catch (error) {
            console.error("❌ Logout failed:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtitle?: string;
  }) => (
    <Card style={[styles.statCard, { backgroundColor: theme.white }]}>
      <View style={styles.statHeader}>
        <View
          style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}
        >
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <Text style={[styles.statTitle, { color: theme.gray }]}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color: theme.black }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: theme.gray }]}>
          {subtitle}
        </Text>
      )}
    </Card>
  );

  const QuickAction = ({
    title,
    icon,
    onPress,
    color,
  }: {
    title: string;
    icon: string;
    onPress: () => void;
    color: string;
  }) => (
    <TouchableOpacity
      style={[styles.quickAction, { backgroundColor: theme.white }]}
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={[styles.quickActionTitle, { color: theme.black }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        style={theme.background === COLORS.background ? "dark" : "light"}
      />

      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.gray }]}>
            Welcome back,
          </Text>
          <Text style={[styles.adminName, { color: theme.black }]}>
            {user?.name || "Admin"}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.notificationButton,
              { backgroundColor: theme.lightGray },
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.black}
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.error }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={theme.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>
            Overview
          </Text>

          <View style={styles.statsGrid}>
            <StatCard
              title="Total Flights"
              value={stats.totalFlights?.toLocaleString?.() || "0"}
              icon="airplane-outline"
              color={theme.primary}
              subtitle={`${
                stats.totalFlights === 0 ? 0 : stats.activeFlights || 0
              } active`}
            />

            <StatCard
              title="Total Bookings"
              value={stats.totalBookings?.toLocaleString?.() || "0"}
              icon="calendar-outline"
              color={theme.secondary}
              subtitle={`${Array.isArray(stats.recentBookings) ? stats.recentBookings.length : stats.recentBookings || 0} this week`}
            />

            <StatCard
              title="Total Users"
              value={stats.totalUsers?.toLocaleString?.() || "0"}
              icon="people-outline"
              color={theme.success}
              subtitle={`${stats.activeUsers || 0} active`}
            />

            <StatCard
              title="Revenue"
              value={`$${((stats.totalRevenue || 0) / 1000000).toFixed(1)}M`}
              icon="card-outline"
              color="#FF6B6B"
              subtitle="Total earnings"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>
            Quick Actions
          </Text>

          <View style={styles.quickActionsGrid}>
            <QuickAction
              title="Add Flight"
              icon="add-circle-outline"
              color={theme.primary}
              onPress={() => navigation.navigate("AdminFlightForm" as any)}
            />
            <QuickAction
              title="View Bookings"
              icon="list-outline"
              color={theme.secondary}
              onPress={() => navigation.navigate("Bookings" as any)}
            />
            <QuickAction
              title="Manage Users"
              icon="people-outline"
              color={theme.success}
              onPress={() => navigation.navigate("Users" as any)}
            />
            <QuickAction
              title="Reports"
              icon="analytics-outline"
              color="#FF6B6B"
              onPress={() => {
                Alert.alert(
                  "Coming Soon",
                  "Reports feature will be available soon!"
                );
              }}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <Card style={[styles.activityCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>
            Recent Activity
          </Text>

          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: `${theme.success}20` },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={theme.success}
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.black }]}>
                  New booking confirmed
                </Text>
                <Text style={[styles.activityTime, { color: theme.gray }]}>
                  2 minutes ago
                </Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <Ionicons name="airplane" size={16} color={theme.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.black }]}>
                  Flight DL123 updated
                </Text>
                <Text style={[styles.activityTime, { color: theme.gray }]}>
                  15 minutes ago
                </Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: `${theme.secondary}20` },
                ]}
              >
                <Ionicons name="person-add" size={16} color={theme.secondary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.black }]}>
                  New user registered
                </Text>
                <Text style={[styles.activityTime, { color: theme.gray }]}>
                  1 hour ago
                </Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: `${theme.error}20` },
                ]}
              >
                <Ionicons name="close-circle" size={16} color={theme.error} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.black }]}>
                  Booking cancelled
                </Text>
                <Text style={[styles.activityTime, { color: theme.gray }]}>
                  2 hours ago
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  greeting: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
  },
  adminName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: COLORS.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 16,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  statTitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    flex: 1,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    marginBottom: 4,
  },
  statSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAction: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionTitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    textAlign: "center",
  },
  activityCard: {
    marginBottom: 16,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
  },
  activityTime: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
});

export default AdminDashboardScreen;
