"use client"

import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Button from "../../components/Button"
import Card from "../../components/Card"
import Input from "../../components/Input"
import { COLORS, FONTS, SHADOWS, SIZES } from "../../constants/theme"

const PaymentScreen = ({ navigation, route }) => {
  const { flight , totalPrice} = route.params || {}
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handlePayment = () => {
    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      setShowSuccessModal(true)
    }, 2000)
  }

  const handleContinue = () => {
    setShowSuccessModal(false)
    navigation.navigate("Main")
  }
  const { theme } = useTheme()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color:theme.black}]}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.paymentMethodsContainer}>
          <Text style={[styles.sectionTitle, {color:theme.black}]}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[styles.paymentOption, {backgroundColor: theme.white}, paymentMethod === "card" && styles.selectedPaymentOption]}
              onPress={() => setPaymentMethod("card")}
            >
              <Ionicons name="card-outline" size={24} color={paymentMethod === "card" ? theme.black : theme.black} />
              <Text style={[styles.paymentOptionText, {color: theme.black}, paymentMethod === "card" && styles.selectedPaymentOptionText]}>
                Credit Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, {backgroundColor: theme.white}, paymentMethod === "paypal" && styles.selectedPaymentOption]}
              onPress={() => setPaymentMethod("paypal")}
            >
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/174/174861.png" }}
                style={[styles.paymentIcon, paymentMethod === "paypal" && { tintColor: COLORS.white }]}
              />
              <Text style={[styles.paymentOptionText, {color: theme.black}, paymentMethod === "paypal" && styles.selectedPaymentOptionText]}>
                PayPal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, {backgroundColor: theme.white}, paymentMethod === "upi" && styles.selectedPaymentOption]}
              onPress={() => setPaymentMethod("upi")}
            >
              <Ionicons name="cash-outline" size={24} color={paymentMethod === "upi" ? theme.black : theme.black} />
              <Text style={[styles.paymentOptionText, {color: theme.black}, paymentMethod === "upi" && styles.selectedPaymentOptionText]}>
                UPI
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {paymentMethod === "card" && (
          <Card style={[styles.cardDetailsContainer, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionTitle, {color:theme.black}]}>Card Details</Text>
            <Input
              label="Cardholder Name"
              placeholder="Enter cardholder name"
              value={cardName}
              onChangeText={setCardName}
              autoCapitalize="words"
            />
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={(text) => {
                // Format card number with spaces
                const formatted = text
                  .replace(/\s/g, "")
                  .replace(/(.{4})/g, "$1 ")
                  .trim()
                setCardNumber(formatted)
              }}
              keyboardType="numeric"
              maxLength={19}
            />
            <View style={styles.rowContainer}>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={(text) => {
                  // Format expiry date with slash
                  if (text.length === 2 && expiryDate.length === 1) {
                    setExpiryDate(text + "/")
                  } else {
                    setExpiryDate(text)
                  }
                }}
                keyboardType="numeric"
                maxLength={5}
                style={{ flex: 1, marginRight: 12 , color: COLORS.gray}}
              />
              <Input
                label="CVV"
                placeholder="123"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                style={{ flex: 1 , color: COLORS.gray}}
              />
            </View>
          </Card>
        )}

        {paymentMethod === "paypal" && (
          <Card style={[styles.alternativePaymentContainer, { backgroundColor: theme.lightGray }]}>
            <View style={styles.alternativePaymentContent}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/174/174861.png" }}
                style={styles.alternativePaymentLogo}
              />
              <Text style={styles.alternativePaymentText}>
                You will be redirected to PayPal to complete your payment securely.
              </Text>
            </View>
          </Card>
        )}

        {paymentMethod === "upi" && (
          <Card style={[styles.alternativePaymentContainer, { backgroundColor: theme.lightGray }]}>
            <View style={styles.alternativePaymentContent}>
              <Ionicons name="cash-outline" size={48} color={COLORS.primary} />
              <Text style={styles.alternativePaymentText}>Enter your UPI ID to proceed with the payment.</Text>
              <Input placeholder="username@upi" />
            </View>
          </Card>
        )}

        <Card style={[styles.priceCard, { backgroundColor: theme.background }]}>
          <Text style={[styles.sectionTitle, {color: theme.black}]}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base Fare</Text>
            <Text style={[styles.priceValue , {color: theme.black}]}>${totalPrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxes & Fees</Text>
            <Text style={[styles.priceValue, {color: theme.black}]}>$45</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, {color: theme.black}]}>Total</Text>
            <Text style={styles.totalValue}>${Number(totalPrice) + 45}</Text>
          </View>
        </Card>

        <Button
          title={`Pay $${totalPrice + 45}`}
          onPress={handlePayment}
          gradient
          loading={loading}
          style={styles.payButton}
        />
      </ScrollView>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Card style={[styles.successModal, { backgroundColor: theme.lightGray }]}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
            </View>
            <Text style={[styles.successTitle, {color:theme.black}]}>Payment Successful!</Text>
            <Text style={styles.successMessage}>
              Your booking has been confirmed. You will receive an email with your e-ticket shortly.
            </Text>
            <Button title="Continue" onPress={handleContinue} gradient style={styles.continueButton} />
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.lightGray,
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginBottom: 16,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentOption: {
    flex: 1,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  selectedPaymentOption: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  paymentOptionText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.black,
    marginTop: 8,
  },
  selectedPaymentOptionText: {
    color: COLORS.white,
  },
  cardDetailsContainer: {
    marginBottom: 24,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  alternativePaymentContainer: {
    marginBottom: 24,
    padding: 24,
  },
  alternativePaymentContent: {
    alignItems: "center",
  },
  alternativePaymentLogo: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  alternativePaymentText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: "center",
    paddingBottom: 10,
  },
  priceCard: {
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  priceValue: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  totalValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  payButton: {
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  successModal: {
    width: "100%",
    padding: 24,
    alignItems: "center",
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.black,
    marginBottom: 8,
  },
  successMessage: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 24,
  },
  continueButton: {
    width: "100%",
  },
})

export default PaymentScreen
