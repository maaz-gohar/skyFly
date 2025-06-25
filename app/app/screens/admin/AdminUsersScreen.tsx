"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
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

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin"
  status: "active" | "inactive"
  registrationDate: string
  avatar: string
  bookingsCount: number
}

const AdminUsersScreen: React.FC = () => {
  const { theme } = useTheme()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [searchQuery, filterRole, users])

  const fetchUsers = async () => {
    try {
      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "+1 (555) 123-4567",
          role: "user",
          status: "active",
          registrationDate: "2023-01-15",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          bookingsCount: 5,
        },
        {
          id: "2",
          name: "Sarah Johnson",
          email: "sarah.johnson@example.com",
          phone: "+1 (555) 987-6543",
          role: "user",
          status: "active",
          registrationDate: "2023-02-22",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
          bookingsCount: 3,
        },
        {
          id: "3",
          name: "Michael Brown",
          email: "michael.brown@example.com",
          phone: "+1 (555) 456-7890",
          role: "admin",
          status: "active",
          registrationDate: "2022-11-10",
          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
          bookingsCount: 0,
        },
        {
          id: "4",
          name: "Emily Davis",
          email: "emily.davis@example.com",
          phone: "+1 (555) 234-5678",
          role: "user",
          status: "inactive",
          registrationDate: "2023-03-05",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          bookingsCount: 2,
        },
        {
          id: "5",
          name: "David Wilson",
          email: "david.wilson@example.com",
          phone: "+1 (555) 876-5432",
          role: "user",
          status: "active",
          registrationDate: "2023-04-18",
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
          bookingsCount: 1,
        },
        {
          id: "6",
          name: "Jennifer Lee",
          email: "jennifer.lee@example.com",
          phone: "+1 (555) 345-6789",
          role: "admin",
          status: "active",
          registrationDate: "2022-12-03",
          avatar: "https://randomuser.me/api/portraits/women/3.jpg",
          bookingsCount: 0,
        },
      ]

      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      Alert.alert("Error", "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let result = [...users]

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.includes(query),
      )
    }

    // Apply role filter
    if (filterRole) {
      result = result.filter((user) => user.role === filterRole)
    }

    setFilteredUsers(result)
  }

  const handleViewUser = (user: User) => {
    Alert.alert("View User", `User details for ${user.name}`, [
      {
        text: "OK",
      },
    ])
  }

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    Alert.alert(
      "Update Status",
      `Are you sure you want to ${newStatus === "active" ? "activate" : "deactivate"} this user?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: () => {
            // In a real app, this would call an API
            setUsers(users.map((user) => (user.id === id ? { ...user, status: newStatus as any } : user)))
            Alert.alert("Success", "User status updated successfully")
          },
        },
      ],
    )
  }

  const handleToggleRole = (id: string, currentRole: string) => {
    const newRole = currentRole === "user" ? "admin" : "user"
    Alert.alert("Update Role", `Are you sure you want to change this user's role to ${newRole}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Update",
        onPress: () => {
          // In a real app, this would call an API
          setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole as any } : user)))
          Alert.alert("Success", "User role updated successfully")
        },
      },
    ])
  }

  const renderUserItem = ({ item }: { item: User }) => (
    <Card style={[styles.userCard, { backgroundColor: theme.white }]}>
      <View style={styles.userHeader}>
        <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.black }]}>{item.name}</Text>
          <Text style={[styles.userEmail, { color: theme.gray }]}>{item.email}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.status === "active" ? `${theme.success}20` : `${theme.error}20`,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === "active" ? theme.success : theme.error,
              },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.userDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={16} color={theme.gray} />
          <Text style={[styles.detailText, { color: theme.black }]}>{item.phone}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.gray} />
          <Text style={[styles.detailText, { color: theme.black }]}>Joined: {item.registrationDate}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={16} color={theme.gray} />
          <Text style={[styles.detailText, { color: theme.black }]}>Role: {item.role}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="airplane-outline" size={16} color={theme.gray} />
          <Text style={[styles.detailText, { color: theme.black }]}>Bookings: {item.bookingsCount}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: `${theme.primary}20` }]}
          onPress={() => handleViewUser(item)}
        >
          <Ionicons name="eye-outline" size={16} color={theme.primary} />
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: item.status === "active" ? `${theme.error}20` : `${theme.success}20`,
            },
          ]}
          onPress={() => handleToggleStatus(item.id, item.status)}
        >
          <Ionicons
            name={item.status === "active" ? "close-outline" : "checkmark-outline"}
            size={16}
            color={item.status === "active" ? theme.error : theme.success}
          />
          <Text
            style={[
              styles.actionButtonText,
              {
                color: item.status === "active" ? theme.error : theme.success,
              },
            ]}
          >
            {item.status === "active" ? "Deactivate" : "Activate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: `${theme.secondary}20` }]}
          onPress={() => handleToggleRole(item.id, item.role)}
        >
          <Ionicons name="swap-horizontal-outline" size={16} color={theme.secondary} />
          <Text style={[styles.actionButtonText, { color: theme.secondary }]}>
            {item.role === "user" ? "Make Admin" : "Make User"}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.background === COLORS.background ? "dark" : "light"} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.black }]}>Manage Users</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.white, borderColor: theme.lightGray }]}>
          <Ionicons name="search" size={20} color={theme.gray} />
          <TextInput
            style={[styles.searchInput, { color: theme.black }]}
            placeholder="Search users..."
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
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: filterRole === null ? theme.primary : `${theme.primary}20`,
              },
            ]}
            onPress={() => setFilterRole(null)}
          >
            <Text
              style={[
                styles.filterChipText,
                {
                  color: filterRole === null ? theme.white : theme.primary,
                },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: filterRole === "user" ? theme.primary : `${theme.primary}20`,
              },
            ]}
            onPress={() => setFilterRole(filterRole === "user" ? null : "user")}
          >
            <Text
              style={[
                styles.filterChipText,
                {
                  color: filterRole === "user" ? theme.white : theme.primary,
                },
              ]}
            >
              Users
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: filterRole === "admin" ? theme.primary : `${theme.primary}20`,
              },
            ]}
            onPress={() => setFilterRole(filterRole === "admin" ? null : "admin")}
          >
            <Text
              style={[
                styles.filterChipText,
                {
                  color: filterRole === "admin" ? theme.white : theme.primary,
                },
              ]}
            >
              Admins
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.gray }]}>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.usersList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color={theme.gray} />
              <Text style={[styles.emptyText, { color: theme.gray }]}>No users found</Text>
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
  usersList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  userCard: {
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
  },
  userEmail: {
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
  userDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginLeft: 8,
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

export default AdminUsersScreen
