"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useEffect, useRef } from "react"
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native"
import { COLORS, FONTS } from "../../constants/theme"
import { useAuth } from "../../context/AuthContext"
import type { ScreenNavigationProp } from "../../types"

interface SplashScreenProps {
  navigation: ScreenNavigationProp<"Splash">
}

const { width, height } = Dimensions.get("window")

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { user, isLoading } = useAuth()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.3)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    // Start animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()

    // Navigate after animations and auth check
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          // Check if user is admin
          if (user.role === "admin") {
            navigation.replace("Admin")
          } else {
            navigation.replace("Main") // Navigate to Main tab navigator, not Home directly
          }
        } else {
          navigation.replace("Welcome")
        }
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [user, isLoading, navigation, fadeAnim, scaleAnim, slideAnim])

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient} />

      {/* Animated Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoBackground}>
          <Ionicons name="airplane" size={60} color={COLORS.white} />
        </View>
      </Animated.View>

      {/* Animated App Name */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.appName}>SkyFly</Text>
        <Text style={styles.tagline}>Your Journey Begins Here</Text>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.loadingDots}>
          <Animated.View style={[styles.dot, styles.dot1]} />
          <Animated.View style={[styles.dot, styles.dot2]} />
          <Animated.View style={[styles.dot, styles.dot3]} />
        </View>
      </Animated.View>

      {/* Version Info */}
      <Animated.View
        style={[
          styles.versionContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    opacity: 0.9,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${COLORS.white}20`,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: 42,
    color: COLORS.white,
    letterSpacing: 2,
    textShadowColor: `${COLORS.black}30`,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: `${COLORS.white}80`,
    marginTop: 8,
    letterSpacing: 1,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 120,
    alignItems: "center",
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  versionContainer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  versionText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: `${COLORS.white}60`,
    letterSpacing: 0.5,
  },
})

export default SplashScreen
