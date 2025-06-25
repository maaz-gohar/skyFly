"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Card from "../../../components/Card"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useAuth } from "../../../context/AuthContext"
import { useTheme } from "../../../context/ThemeContext"
import type { ScreenNavigationProp } from "../../../types"

interface SettingsScreenProps {
  navigation: ScreenNavigationProp<"Settings">
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth()
  const { isDarkMode, toggleTheme, theme } = useTheme()

  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
    },
    privacy: {
      shareData: false,
      locationServices: true,
      analytics: true,
    },
    security: {
      biometricLogin: true,
      twoFactorAuth: false,
    },
  })

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          await logout()
          navigation.navigate("Welcome")
        },
      },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Are you sure you want to delete your account? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Coming Soon", "Account deletion will be available soon!")
        },
      },
    ])
  }

  const renderSettingItem = (
    title: string,
    description: string,
    value: boolean,
    onToggle: (value: boolean) => void,
    icon?: string,
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        {icon && (
          <View style={[styles.settingIconContainer, { backgroundColor: `${theme.primary}20` }]}>
            <Ionicons name={icon as any} size={20} color={theme.primary} />
          </View>
        )}
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: theme.black }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: theme.gray }]}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.lightGray, true: `${theme.primary}80` }}
        thumbColor={value ? theme.primary : theme.white}
      />
    </View>
  )

  const renderActionItem = (
    title: string,
    description: string,
    icon: string,
    onPress: () => void,
    isDestructive = false,
  ) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.settingInfo}>
        <View
          style={[
            styles.settingIconContainer,
            { backgroundColor: isDestructive ? `${theme.error}20` : `${theme.primary}20` },
          ]}
        >
          <Ionicons name={icon as any} size={20} color={isDestructive ? theme.error : theme.primary} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: isDestructive ? theme.error : theme.black }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: theme.gray }]}>{description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.gray} />
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
        <Text style={[styles.headerTitle, { color: theme.black }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Account Section */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Account</Text>

          <View style={styles.accountInfo}>
            <View style={styles.accountDetails}>
              <Text style={[styles.accountName, { color: theme.black }]}>{user?.name}</Text>
              <Text style={[styles.accountEmail, { color: theme.gray }]}>{user?.email}</Text>
            </View>
            <TouchableOpacity
              style={[styles.editAccountButton, { backgroundColor: `${theme.primary}20` }]}
              onPress={() => navigation.navigate("PersonalInfo")}
            >
              <Text style={[styles.editAccountText, { color: theme.primary }]}>Edit</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Appearance Section */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Appearance</Text>

          {renderSettingItem(
            "Dark Mode",
            "Switch between light and dark themes",
            isDarkMode,
            toggleTheme,
            "moon-outline",
          )}
        </Card>

        {/* Notifications Section */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Notifications</Text>

          {renderSettingItem(
            "Push Notifications",
            "Receive notifications on your device",
            settings.notifications.pushNotifications,
            (value) =>
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, pushNotifications: value },
              }),
            "notifications-outline",
          )}

          {renderSettingItem(
            "Email Notifications",
            "Receive updates via email",
            settings.notifications.emailNotifications,
            (value) =>
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, emailNotifications: value },
              }),
            "mail-outline",
          )}

          {renderSettingItem(
            "SMS Notifications",
            "Receive updates via SMS",
            settings.notifications.smsNotifications,
            (value) =>
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, smsNotifications: value },
              }),
            "chatbubble-outline",
          )}

          {renderSettingItem(
            "Marketing Emails",
            "Receive promotional offers",
            settings.notifications.marketingEmails,
            (value) =>
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, marketingEmails: value },
              }),
            "megaphone-outline",
          )}
        </Card>

        {/* Privacy Section */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Privacy</Text>

          {renderSettingItem(
            "Share Usage Data",
            "Help improve the app by sharing anonymous data",
            settings.privacy.shareData,
            (value) =>
              setSettings({
                ...settings,
                privacy: { ...settings.privacy, shareData: value },
              }),
            "analytics-outline",
          )}

          {renderSettingItem(
            "Location Services",
            "Allow app to access your location",
            settings.privacy.locationServices,
            (value) =>
              setSettings({
                ...settings,
                privacy: { ...settings.privacy, locationServices: value },
              }),
            "location-outline",
          )}

          {renderSettingItem(
            "Analytics",
            "Allow collection of usage analytics",
            settings.privacy.analytics,
            (value) =>
              setSettings({
                ...settings,
                privacy: { ...settings.privacy, analytics: value },
              }),
            "bar-chart-outline",
          )}
        </Card>

        {/* Security Section */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Security</Text>

          {renderSettingItem(
            "Biometric Login",
            "Use fingerprint or face ID to login",
            settings.security.biometricLogin,
            (value) =>
              setSettings({
                ...settings,
                security: { ...settings.security, biometricLogin: value },
              }),
            "finger-print-outline",
          )}

          {renderSettingItem(
            "Two-Factor Authentication",
            "Add an extra layer of security",
            settings.security.twoFactorAuth,
            (value) =>
              setSettings({
                ...settings,
                security: { ...settings.security, twoFactorAuth: value },
              }),
            "shield-checkmark-outline",
          )}

          {renderActionItem("Change Password", "Update your account password", "key-outline", () =>
            Alert.alert("Coming Soon", "Password change will be available soon!"),
          )}
        </Card>

        {/* Support Section */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Support</Text>

          {renderActionItem("Help Center", "Get help and support", "help-circle-outline", () =>
            navigation.navigate("HelpSupport"),
          )}

          {renderActionItem("Contact Us", "Send feedback or report issues", "mail-outline", () =>
            navigation.navigate("HelpSupport"),
          )}

          {renderActionItem("Rate App", "Rate us on the app store", "star-outline", () =>
            Alert.alert("Coming Soon", "App rating will be available soon!"),
          )}
        </Card>

        {/* Account Actions */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Account Actions</Text>

          {renderActionItem("Logout", "Sign out of your account", "log-out-outline", handleLogout)}

          {renderActionItem(
            "Delete Account",
            "Permanently delete your account",
            "trash-outline",
            handleDeleteAccount,
            true,
          )}
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.gray }]}>SkyFly v1.0.0</Text>
        </View>
      </ScrollView>
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
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sectionCard: {
    marginTop: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    marginBottom: 16,
  },
  accountInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
  },
  accountEmail: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  editAccountButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  editAccountText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
  },
  settingDescription: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
  },
})

export default SettingsScreen
