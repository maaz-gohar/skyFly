"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Button from "../../components/Button"
import Input from "../../components/Input"
import { COLORS, FONTS, SIZES } from "../../constants/theme"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import type { ScreenNavigationProp } from "../../types"

interface LoginScreenProps {
  navigation: ScreenNavigationProp<"Login">
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const { theme } = useTheme()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password")
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      navigation.navigate("Main")
    } catch (error) {
      Alert.alert("Login Failed", error instanceof Error ? error.message : "Please check your credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.background === COLORS.background ? "dark" : "light"} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.lightGray }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.black} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.black }]}>Welcome Back!</Text>
          <Text style={[styles.subtitle, { color: theme.gray }]}>Sign in to continue your journey</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>Forgot password?</Text>
          </TouchableOpacity>

          <Button title="Login" onPress={handleLogin} gradient loading={loading} style={styles.loginButton} />

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.lightGray }]} />
            <Text style={[styles.dividerText, { color: theme.gray }]}>OR</Text>
            <View style={[styles.divider, { backgroundColor: theme.lightGray }]} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.white }]}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png" }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.white }]}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png" }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.gray }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={[styles.signUpText, { color: theme.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  loginButton: {
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
  signUpText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
  },
})

export default LoginScreen
