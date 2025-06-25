"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import Input from "../../../components/Input"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"
import type { ScreenNavigationProp } from "../../../types"

interface HelpSupportScreenProps {
  navigation: ScreenNavigationProp<"HelpSupport">
}

const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()
  const [selectedTab, setSelectedTab] = useState("faq")
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  })

  const faqData = [
    {
      id: "1",
      question: "How can I cancel my booking?",
      answer:
        "You can cancel your booking by going to 'My Bookings' and selecting the booking you want to cancel. Please note that cancellation fees may apply depending on the fare type.",
    },
    {
      id: "2",
      question: "Can I change my flight dates?",
      answer:
        "Yes, you can change your flight dates subject to availability and fare rules. Additional charges may apply for date changes.",
    },
    {
      id: "3",
      question: "How do I check-in for my flight?",
      answer:
        "You can check-in online through our app starting 24 hours before your flight departure. You can also check-in at the airport counter.",
    },
    {
      id: "4",
      question: "What is the baggage allowance?",
      answer:
        "Baggage allowance varies by airline and fare type. Generally, economy class allows 1 carry-on bag (7kg) and 1 checked bag (20kg).",
    },
    {
      id: "5",
      question: "How can I request special assistance?",
      answer:
        "You can request special assistance during booking or by contacting our customer service team at least 48 hours before your flight.",
    },
  ]

  const contactOptions = [
    {
      id: "1",
      title: "Call Us",
      subtitle: "+1 (555) 123-4567",
      icon: "call-outline",
      action: () => Linking.openURL("tel:+15551234567"),
    },
    {
      id: "2",
      title: "Email Support",
      subtitle: "support@skyfly.com",
      icon: "mail-outline",
      action: () => Linking.openURL("mailto:support@skyfly.com"),
    },
    {
      id: "3",
      title: "Live Chat",
      subtitle: "Available 24/7",
      icon: "chatbubble-outline",
      action: () => Alert.alert("Coming Soon", "Live chat will be available soon!"),
    },
    {
      id: "4",
      title: "WhatsApp",
      subtitle: "+1 (555) 987-6543",
      icon: "logo-whatsapp",
      action: () => Linking.openURL("https://wa.me/15559876543"),
    },
  ]

  const handleSubmitContactForm = () => {
    if (!contactForm.subject || !contactForm.message) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    Alert.alert("Success", "Your message has been sent. We'll get back to you within 24 hours.")
    setContactForm({ subject: "", message: "" })
  }

  const renderFAQ = () => (
    <View style={styles.faqContainer}>
      {faqData.map((item) => (
        <Card key={item.id} style={[styles.faqCard, { backgroundColor: theme.white }]}>
          <Text style={[styles.faqQuestion, { color: theme.black }]}>{item.question}</Text>
          <Text style={[styles.faqAnswer, { color: theme.gray }]}>{item.answer}</Text>
        </Card>
      ))}
    </View>
  )

  const renderContact = () => (
    <View style={styles.contactContainer}>
      <Text style={[styles.sectionTitle, { color: theme.black }]}>Get in Touch</Text>

      <View style={styles.contactOptionsGrid}>
        {contactOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.contactOption, { backgroundColor: theme.white }]}
            onPress={option.action}
          >
            <View style={[styles.contactIconContainer, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons name={option.icon as any} size={24} color={theme.primary} />
            </View>
            <Text style={[styles.contactTitle, { color: theme.black }]}>{option.title}</Text>
            <Text style={[styles.contactSubtitle, { color: theme.gray }]}>{option.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={[styles.contactFormCard, { backgroundColor: theme.white }]}>
        <Text style={[styles.formTitle, { color: theme.black }]}>Send us a Message</Text>

        <Input
          label="Subject"
          placeholder="Enter subject"
          value={contactForm.subject}
          onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
          icon="document-text-outline"
        />

        <View style={styles.messageContainer}>
          <Text style={[styles.messageLabel, { color: theme.black }]}>Message</Text>
          <View style={[styles.messageInputContainer, { borderColor: theme.lightGray, backgroundColor: theme.white }]}>
            <Input
              placeholder="Enter your message"
              value={contactForm.message}
              onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
              multiline
              numberOfLines={4}
              style={styles.messageInput}
            />
          </View>
        </View>

        <Button title="Send Message" onPress={handleSubmitContactForm} gradient style={styles.sendButton} />
      </Card>
    </View>
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
        <Text style={[styles.headerTitle, { color: theme.black }]}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "faq" && [styles.activeTabButton, { borderBottomColor: theme.primary }],
          ]}
          onPress={() => setSelectedTab("faq")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "faq" && [styles.activeTabText, { color: theme.primary }],
              { color: theme.gray },
            ]}
          >
            FAQ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "contact" && [styles.activeTabButton, { borderBottomColor: theme.primary }],
          ]}
          onPress={() => setSelectedTab("contact")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "contact" && [styles.activeTabText, { color: theme.primary }],
              { color: theme.gray },
            ]}
          >
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {selectedTab === "faq" ? renderFAQ() : renderContact()}
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
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
  },
  activeTabText: {
    fontFamily: FONTS.semiBold,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  faqContainer: {
    marginTop: 8,
  },
  faqCard: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
    marginBottom: 8,
  },
  faqAnswer: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    lineHeight: 20,
  },
  contactContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    marginBottom: 16,
  },
  contactOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  contactOption: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
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
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  contactTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
    marginBottom: 4,
  },
  contactSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    textAlign: "center",
  },
  contactFormCard: {
    marginTop: 8,
  },
  formTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    marginBottom: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginBottom: 8,
  },
  messageInputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 100,
  },
  messageInput: {
    marginBottom: 0,
  },
  sendButton: {
    marginTop: 8,
  },
})

export default HelpSupportScreen
