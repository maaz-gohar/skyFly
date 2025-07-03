"use client"

import { getAllUsers, updateUserRole, updateUserStatus } from "@/api/admin"
import { User } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import type React from "react"
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

const AdminUsersScreen = () => {
  const { theme } = useTheme()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers()
        const fetchedUsers = response?.data?.users || response?.data || []
        if (response.success && fetchedUsers.length > 0) {
          setUsers(fetchedUsers)
        } else {
          setError(response.message || "No users found.")
        }
      } catch (err) {
        setError("Something went wrong.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesRole = filterRole ? user.role === filterRole : true
      const matchesQuery =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesRole && matchesQuery
    })

    setFilteredUsers(filtered)
  }, [users, searchQuery, filterRole])

  const handleViewUser = (user: User) => {
    Alert.alert("View User", `User details for ${user.name}`)
  }

const handleToggleStatus = async (userId: string, currentStatus: string) => {
  const newStatus = currentStatus === "active" ? "inactive" : "active"
  Alert.alert("Update Status", `Make user ${newStatus}?`, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Update",
      onPress: async () => {
        try {
          const response = await updateUserStatus(userId, newStatus === "active")
          if (response.success && response.data) {
            setUsers((prevUsers) =>
              prevUsers.map((u) =>
                u._id === userId ? { ...u, status: response.data.status } : u
              )
            )
            console.log("Role updated successfully:", response.data)
          } else {
            Alert.alert("Error", response.message || "Failed to update status.")
          }
        } catch (error) {
          Alert.alert("Error", "Something went wrong.")
        }
      },
    },
  ])
}

const handleToggleRole = async (userId: string, currentRole: string) => {
  const newRole = currentRole === "user" ? "admin" : "user"
  Alert.alert("Change Role", `Make this user ${newRole}?`, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Update",
      onPress: async () => {
        try {
          const response = await updateUserRole(userId, newRole as "user" | "admin")
          if (response.success && response.data) {
            setUsers((prevUsers) =>
              prevUsers.map((u) =>
                u._id === userId ? { ...u, role: response.data.role } : u
              )
            )
            
          } else {
            Alert.alert("Error", response.message || "Failed to update role.")
          }
        } catch (error) {
          Alert.alert("Error", "Something went wrong.")
        }
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
          <Text style={[styles.detailText, { color: theme.black }]}>
            Joined: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={16} color={theme.gray} />
          <Text style={[styles.detailText, { color: theme.black }]}>Role: {item.role}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${theme.primary}20` }]} onPress={() => handleViewUser(item)}>
          <Ionicons name="eye-outline" size={16} color={theme.primary} />
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: item.status === "active" ? `${theme.error}20` : `${theme.success}20` },
          ]}
          onPress={() => handleToggleStatus(item._id, item.status)}
        >
          <Ionicons
            name={item.status === "active" ? "close-outline" : "checkmark-outline"}
            size={16}
            color={item.status === "active" ? theme.error : theme.success}
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: item.status === "active" ? theme.error : theme.success },
            ]}
          >
            {item.status === "active" ? "Deactivate" : "Activate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${theme.secondary}20` }]} onPress={() => handleToggleRole(item._id, item.role)}>
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
          {["All", "user", "admin"].map((role) => {
            const selected = filterRole === (role === "All" ? null : role)
            return (
              <TouchableOpacity
                key={role}
                style={[styles.filterChip, { backgroundColor: selected ? theme.primary : `${theme.primary}20` }]}
                onPress={() => setFilterRole(role === "All" ? null : role)}
              >
                <Text style={[styles.filterChipText, { color: selected ? theme.white : theme.primary }]}>
                  {role === "All" ? "All" : role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          })}
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
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.usersList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color={theme.gray} />
              <Text style={[styles.emptyText, { color: theme.gray }]}>No users found</Text>
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
  paginationContainer: {
  flexDirection: "row",
  justifyContent: "center",
  gap: 10,
  marginTop: 10,
  marginBottom: 20,
},
pageButton: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
},

})

export default AdminUsersScreen
