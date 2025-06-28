"use client";

import type React from "react";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/Card";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import type { ScreenNavigationProp } from "../../types";


interface ProfileScreenProps {
  navigation: ScreenNavigationProp<"Profile">;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [storedName, setStoredName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);



  const menuItems = [
    {
      id: "1",
      title: "Personal Information",
      icon: "person-outline",
      screen: "PersonalInfo",
    },
    {
      id: "2",
      title: "Payment Methods",
      icon: "card-outline",
      screen: "PaymentMethods",
    },
    {
      id: "3",
      title: "Travel Preferences",
      icon: "airplane-outline",
      screen: "TravelPreferences",
    },
    {
      id: "4",
      title: "Frequent Flyer Programs",
      icon: "star-outline",
      screen: "FrequentFlyer",
    },
    {
      id: "5",
      title: "Help & Support",
      icon: "help-circle-outline",
      screen: "HelpSupport",
    },
    {
      id: "6",
      title: "About",
      icon: "information-circle-outline",
      screen: "About",
    },
  ];

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
          navigation.navigate("Welcome");
        },
      },
    ]);
  };
useEffect(() => {
  const loadStoredName = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setStoredName(user.name);
      }
    } catch (error) {
      console.error("Failed to load user from AsyncStorage:", error);
    }
  };

  loadStoredName();
}, []);

const handleChangeProfileImage = () => {
  Alert.alert("Update Profile Picture", "Choose an option", [
    {
      text: "Camera",
      onPress: async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Camera access is required.");
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        if (!result.canceled && result.assets.length > 0) {
          setProfileImage(result.assets[0].uri);
        }
      },
    },
    {
      text: "Gallery",
      onPress: async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Gallery access is required.");
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        if (!result.canceled && result.assets.length > 0) {
          setProfileImage(result.assets[0].uri);
        }
      },
    },
    {
      text: "Cancel",
      style: "cancel",
    },
  ]);
};


// const getName = await AsyncStorage.getItem("user");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        style={theme.background === COLORS.background ? "dark" : "light"}
      />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.black }]}>
          Profile
        </Text>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.lightGray }]}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings-outline" size={24} color={theme.black} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{uri: profileImage || "https://randomuser.me/api/portraits/men/32.jpg"}}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={handleChangeProfileImage}
            >
              <Ionicons name="camera-outline" size={20} color={theme.white} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: theme.black }]}>
            {user?.name || storedName || "Guest User"}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.gray }]}>
            {user?.email || "guest@example.com"}
          </Text>
          <TouchableOpacity
            style={[
              styles.editProfileButton,
              { backgroundColor: `${theme.primary}20` },
            ]}
            onPress={() => navigation.navigate("PersonalInfo")}
          >
            <Text style={[styles.editProfileText, { color: theme.primary }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>
            Account Settings
          </Text>
          <Card style={[styles.menuCard, { backgroundColor: theme.white }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen as any)}
              >
                <View
                  style={[
                    styles.menuIconContainer,
                    { backgroundColor: `${theme.primary}20` },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={theme.primary}
                  />
                </View>
                <Text style={[styles.menuItemText, { color: theme.black }]}>
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={theme.gray} />
                {index !== menuItems.length - 1 && (
                  <View
                    style={[
                      styles.menuDivider,
                      { backgroundColor: theme.lightGray },
                    ]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        <View style={styles.preferencesSection}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>
            Preferences
          </Text>
          <Card
            style={[styles.preferencesCard, { backgroundColor: theme.white }]}
          >
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceTitle, { color: theme.black }]}>
                  Dark Mode
                </Text>
                <Text
                  style={[styles.preferenceDescription, { color: theme.gray }]}
                >
                  Switch to dark theme
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{
                  false: theme.lightGray,
                  true: `${theme.primary}80`,
                }}
                thumbColor={isDarkMode ? theme.primary : theme.white}
              />
            </View>
          </Card>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: `${theme.error}20` }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.error} />
          <Text style={[styles.logoutText, { color: theme.error }]}>
            Logout
          </Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: theme.gray }]}>
          Version 1.0.0
        </Text>
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
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.extraLarge,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
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
  profileName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editProfileText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    marginBottom: 16,
  },
  menuCard: {
    padding: 0,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    flex: 1,
  },
  menuDivider: {
    position: "absolute",
    bottom: 0,
    left: 64,
    right: 16,
    height: 1,
  },
  preferencesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  preferencesCard: {
    padding: 0,
    overflow: "hidden",
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceTitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
  },
  preferenceDescription: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoutText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    textAlign: "center",
  },
});

export default ProfileScreen;
