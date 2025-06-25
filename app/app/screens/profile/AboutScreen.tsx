"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Card from "../../../components/Card"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"
import type { ScreenNavigationProp } from "../../../types"

interface AboutScreenProps {
  navigation: ScreenNavigationProp<"About">
}

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()

  const teamMembers = [
    {
      id: "1",
      name: "John Smith",
      role: "CEO & Founder",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "CTO",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: "3",
      name: "Mike Chen",
      role: "Head of Product",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
  ]

  const socialLinks = [
    {
      id: "1",
      name: "Website",
      icon: "globe-outline",
      url: "https://skyfly.com",
    },
    {
      id: "2",
      name: "Twitter",
      icon: "logo-twitter",
      url: "https://twitter.com/skyfly",
    },
    {
      id: "3",
      name: "Facebook",
      icon: "logo-facebook",
      url: "https://facebook.com/skyfly",
    },
    {
      id: "4",
      name: "Instagram",
      icon: "logo-instagram",
      url: "https://instagram.com/skyfly",
    },
  ]

  const handleLinkPress = (url: string) => {
    Linking.openURL(url)
  }

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
        <Text style={[styles.headerTitle, { color: theme.black }]}>About SkyFly</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoSection}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/5968/5968534.png" }}
            style={[styles.logo, { tintColor: theme.primary }]}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: theme.black }]}>SkyFly</Text>
          <Text style={[styles.version, { color: theme.gray }]}>Version 1.0.0</Text>
        </View>

        <Card style={[styles.aboutCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Our Mission</Text>
          <Text style={[styles.missionText, { color: theme.gray }]}>
            At SkyFly, we're dedicated to making air travel accessible, affordable, and enjoyable for everyone. We
            believe that exploring the world should be simple, which is why we've created a platform that connects
            travelers with the best flight deals and experiences.
          </Text>
        </Card>

        <Card style={[styles.aboutCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>What We Do</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="search-outline" size={20} color={theme.primary} />
              <Text style={[styles.featureText, { color: theme.gray }]}>
                Search and compare flights from hundreds of airlines
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="card-outline" size={20} color={theme.primary} />
              <Text style={[styles.featureText, { color: theme.gray }]}>Secure and easy booking process</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="notifications-outline" size={20} color={theme.primary} />
              <Text style={[styles.featureText, { color: theme.gray }]}>
                Real-time flight updates and notifications
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="headset-outline" size={20} color={theme.primary} />
              <Text style={[styles.featureText, { color: theme.gray }]}>24/7 customer support</Text>
            </View>
          </View>
        </Card>

        <Card style={[styles.aboutCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Our Team</Text>
          <View style={styles.teamGrid}>
            {teamMembers.map((member) => (
              <View key={member.id} style={styles.teamMember}>
                <Image source={{ uri: member.image }} style={styles.memberImage} />
                <Text style={[styles.memberName, { color: theme.black }]}>{member.name}</Text>
                <Text style={[styles.memberRole, { color: theme.gray }]}>{member.role}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={[styles.aboutCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Connect With Us</Text>
          <View style={styles.socialLinks}>
            {socialLinks.map((link) => (
              <TouchableOpacity
                key={link.id}
                style={[styles.socialLink, { backgroundColor: `${theme.primary}20` }]}
                onPress={() => handleLinkPress(link.url)}
              >
                <Ionicons name={link.icon as any} size={24} color={theme.primary} />
                <Text style={[styles.socialLinkText, { color: theme.primary }]}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={[styles.aboutCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.black }]}>Legal</Text>
          <TouchableOpacity style={styles.legalLink}>
            <Text style={[styles.legalLinkText, { color: theme.primary }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.gray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalLink}>
            <Text style={[styles.legalLinkText, { color: theme.primary }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.gray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalLink}>
            <Text style={[styles.legalLinkText, { color: theme.primary }]}>Cookie Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.gray} />
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.gray }]}>© 2023 SkyFly. All rights reserved.</Text>
          <Text style={[styles.footerText, { color: theme.gray }]}>Made with ❤️ for travelers worldwide</Text>
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
  logoSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xxl,
    marginBottom: 8,
  },
  version: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
  },
  aboutCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    marginBottom: 12,
  },
  missionText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    lineHeight: 22,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    flex: 1,
  },
  teamGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  teamMember: {
    alignItems: "center",
    width: "30%",
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  memberName: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.small,
    textAlign: "center",
  },
  memberRole: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    textAlign: "center",
    marginTop: 2,
  },
  socialLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  socialLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
  },
  socialLinkText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  legalLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  legalLinkText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    textAlign: "center",
  },
})

export default AboutScreen
