"use client";

import type React from "react";

import { Ionicons } from "@expo/vector-icons";
import type { ImagePickerAsset } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import type { ScreenNavigationProp } from "../../types";

interface SignUpScreenProps {
  navigation: ScreenNavigationProp<"SignUp">;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<ImagePickerAsset | null>(null);

  const { signup } = useAuth();
  const { theme } = useTheme();

  const handleSignUp = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address ||
      !city ||
      !country ||
      !avatar
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await signup(
        name,
        email,
        password,
        confirmPassword,
        phone,
        address,
        city,
        country,
        avatar
          ? {
              uri: avatar.uri,
              name: avatar.fileName || "avatar.jpg",
              type: avatar.type || "image/jpeg",
            }
          : undefined
      );

      navigation.navigate("Main");
    } catch (error) {
      Alert.alert(
        "Sign Up Failed",
        error instanceof Error ? error.message : "Please check your information"
      );
    } finally {
      setLoading(false);
    }
  };
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        style={theme.background === COLORS.background ? "dark" : "light"}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.lightGray }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.black} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.black }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.gray }]}>
            Sign up to start your journey
          </Text>
        </View>

        <View style={styles.formContainer}>
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
            placeholder="Enter your Address"
            value={address}
            onChangeText={setAddress}
            icon="call-outline"
          />

          <Input
            label="City"
            placeholder="Enter your City"
            value={city}
            onChangeText={setCity}
            icon="call-outline"
          />

          <Input
            label="Country"
            placeholder="Enter your Country"
            value={country}
            onChangeText={setCountry}
            icon="call-outline"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />
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

          <Button
            title="Sign Up"
            onPress={handleSignUp}
            gradient
            loading={loading}
            style={styles.signUpButton}
          />

          <View style={styles.dividerContainer}>
            <View
              style={[styles.divider, { backgroundColor: theme.lightGray }]}
            />
            <Text style={[styles.dividerText, { color: theme.gray }]}>OR</Text>
            <View
              style={[styles.divider, { backgroundColor: theme.lightGray }]}
            />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: theme.white }]}
            >
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
                }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: theme.white }]}
            >
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png",
                }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.gray }]}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.loginText, { color: theme.primary }]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    marginTop: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xxl,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
  },
  formContainer: {
    marginBottom: 24,
  },
  signUpButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginHorizontal: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  socialIcon: {
    width: 30,
    height: 30,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingVertical: 16,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
  },
  loginText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
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
});

export default SignUpScreen;
