"use client"

import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import { StatusBar } from "expo-status-bar"
import type React from "react"
import { useEffect, useState } from "react"
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { updateUserProfile } from "../../../api/user"
import Button from "../../../components/Button"
import Input from "../../../components/Input"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useAuth } from "../../../context/AuthContext"
import { useTheme } from "../../../context/ThemeContext"
import type { ScreenNavigationProp } from "../../../types"

interface PersonalInfoScreenProps {
  navigation: ScreenNavigationProp<"PersonalInfo">
}

const PersonalInfoScreen: React.FC<PersonalInfoScreenProps> = ({ navigation }) => {
  const { user, updateUser } = useAuth()
  const { theme } = useTheme()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState<{ uri: string } | null>(null)

  // Prefill form fields
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
      setAddress(user.address || "")
      setCity(user.city || "")
      setCountry(user.country || "")
      setAvatar(user.avatar ? { uri: user.avatar } : null)
    }
  }, [user])

  const handleSave = async () => {
    if (!name || !email || !phone) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const userData = await AsyncStorage.getItem("user")
      console.log("🔄 Retrieved user data from storage:", userData)
      if (!userData) throw new Error("User not found in storage")

      const parsedUser = JSON.parse(userData)
      const userId = parsedUser._id

      await updateUserProfile(userId, {
        name,
        email,
        phone,
        address,
        city,
        country,
        avatar: avatar?.uri
      })

      // Update context
      updateUser({
        name,
        email,
        phone,
        address,
        city,
        country,
        avatar: avatar?.uri
      })

      // Update local storage
      const updatedUser = {
        ...parsedUser,
        name,
        email,
        phone,
        address,
        city,
        country,
        avatar: avatar?.uri
      }
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))



      Alert.alert("Success", "Profile updated successfully")
      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }
    const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow media access to select a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0]);
    }
  };

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
        <Text style={[styles.headerTitle, { color: theme.black }]}>Personal Information</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
                    <TouchableOpacity onPress={pickAvatar} style={styles.avatarPicker}>
                      {avatar ? (
                        <Image source={{ uri: avatar.uri }} style={styles.avatar} />
                      ) : (
                        <View
                          style={[
                            styles.avatarPlaceholder,
                            { backgroundColor: theme.lightGray },
                          ]}
                        >
                          <Ionicons name="camera-outline" size={32} color={theme.gray} />
                          <Text style={{ color: theme.gray }}>Add Photo</Text>
                        </View>
                      )}
                    </TouchableOpacity>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            icon="person-outline"
            autoCapitalize="words"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
          />

          <Input
            label="Phone"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            icon="call-outline"
            keyboardType="phone-pad"
          />

          <Input
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
            icon="home-outline"
          />

          <View style={styles.rowContainer}>
            <Input
              label="City"
              placeholder="Enter city"
              value={city}
              onChangeText={setCity}
            />
            <Input
              label="Country"
              placeholder="Enter country"
              value={country}
              onChangeText={setCountry}
            />
          </View>

          <Button title="Save Changes" onPress={handleSave} gradient loading={loading} style={styles.saveButton} />
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
  formContainer: {
    marginTop: 16,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    marginTop: 24,
  },
    avatarPicker: {
    alignSelf: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default PersonalInfoScreen
