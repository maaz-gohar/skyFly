import type { StackNavigationProp } from "@react-navigation/stack"
import { LinearGradient } from "expo-linear-gradient"
import { StatusBar } from "expo-status-bar"
import type React from "react"
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootStackParamList } from "../../app/_layout"
import Button from "../../components/Button"
import { COLORS, FONTS, SIZES } from "../../constants/theme"

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Welcome">

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      }}
      style={styles.backgroundImage}
    >
      <StatusBar style="light" />
      <LinearGradient colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/5968/5968534.png" }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>SkyFly</Text>
            <Text style={styles.tagline}>Your journey begins here</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={() => navigation.navigate("Login")} gradient style={styles.button} />
            <Button
              title="Sign Up"
              onPress={() => navigation.navigate("SignUp")}
              outlined
              style={styles.button}
              textStyle={{ color: COLORS.white }}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: COLORS.white,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xxxl,
    color: COLORS.white,
    marginTop: 16,
  },
  tagline: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.white,
    marginTop: 8,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 16,
    gap: 16,
  },
  button: {
    width: "100%",
  },
})

export default WelcomeScreen
