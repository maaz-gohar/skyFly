"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"
import type { ScreenNavigationProp } from "../../../types"

interface PaymentMethodsScreenProps {
  navigation: ScreenNavigationProp<"PaymentMethods">
}

interface PaymentMethod {
  id: string
  type: "Credit Card" | "Debit Card" | "PayPal"
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  isDefault: boolean
}

const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        // Mock data for demonstration
        setPaymentMethods([
          {
            id: "1",
            type: "Credit Card",
            cardNumber: "•••• •••• •••• 4242",
            cardHolder: "John Doe",
            expiryDate: "12/25",
            isDefault: true,
          },
          {
            id: "2",
            type: "PayPal",
            isDefault: false,
          },
        ])
      } catch (error) {
        Alert.alert("Error", "Failed to load payment methods")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentMethods()
  }, [])

  const handleAddPaymentMethod = () => {
    Alert.alert("Coming Soon", "This feature will be available soon!")
  }

  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert("Delete Payment Method", "Are you sure you want to delete this payment method?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
        },
        style: "destructive",
      },
    ])
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  const getCardIcon = (type: string) => {
    if (type === "PayPal") {
      return "https://cdn-icons-png.flaticon.com/512/174/174861.png"
    }
    return "https://cdn-icons-png.flaticon.com/512/6404/6404078.png"
  }

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <Card style={[styles.paymentCard, { backgroundColor: theme.white }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Image source={{ uri: getCardIcon(item.type) }} style={styles.cardIcon} />
          <View style={styles.cardDetails}>
            <Text style={[styles.cardType, { color: theme.black }]}>{item.type}</Text>
            {item.cardNumber && <Text style={[styles.cardNumber, { color: theme.gray }]}>{item.cardNumber}</Text>}
            {item.cardHolder && <Text style={[styles.cardHolder, { color: theme.gray }]}>{item.cardHolder}</Text>}
          </View>
        </View>
        <View style={styles.cardActions}>
          {item.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: `${theme.success}20` }]}>
              <Text style={[styles.defaultText, { color: theme.success }]}>Default</Text>
            </View>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={() => handleDeletePaymentMethod(item.id)}>
            <Ionicons name="trash-outline" size={20} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>
      {!item.isDefault && (
        <TouchableOpacity
          style={[styles.setDefaultButton, { backgroundColor: `${theme.primary}20` }]}
          onPress={() => handleSetDefault(item.id)}
        >
          <Text style={[styles.setDefaultText, { color: theme.primary }]}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </Card>
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
        <Text style={[styles.headerTitle, { color: theme.black }]}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          data={paymentMethods}
          renderItem={renderPaymentMethod}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.paymentsList}
        />

        <Button title="Add Payment Method" onPress={handleAddPaymentMethod} outlined style={styles.addButton} />
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
  paymentsList: {
    marginTop: 16,
  },
  paymentCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardType: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
  },
  cardNumber: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  cardHolder: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  defaultText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  actionButton: {
    padding: 8,
  },
  setDefaultButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  setDefaultText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  addButton: {
    marginTop: 24,
  },
})

export default PaymentMethodsScreen
