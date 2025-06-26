"use client"

import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Button from "../../components/Button"
import Card from "../../components/Card"
import Input from "../../components/Input"
import { COLORS, FONTS, SIZES } from "../../constants/theme"

const FlightDetailsScreen = ({ navigation, route }) => {
  // const { flight } = route.params || {}
  const [selectedTab, setSelectedTab] = useState("details")
  const [passengerDetails, setPassengerDetails] = useState(1)
  const [selectedMeal, setSelectedMeal] = useState("Regular")
  const [selectedBaggage, setSelectedBaggage] = useState("20kg")


  const { theme } = useTheme()
    const { flight, searchParams } = route.params
  const {
    airline,
    logo,
    flightNumber,
    origin,
    destination,
    departureTime,
    arrivalTime,
    duration,
    stops,
    price,
    class: flightClass,
  } = flight
  
  const [totalPrice, setTotalPrice] = useState(0)

  const passengers = Number(searchParams.passengers) || 1

   useEffect(() => {
    setTotalPrice(price * passengers)
  }, [price, passengers])


  const handleProceedToPayment = () => { 
    navigation.navigate("Payment", { flight, passengerDetails , totalPrice,})
  }


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.background === COLORS.background ? "dark" : "light"} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.black }]}>Flight Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
<Card style={[styles.flightSummaryCard, { backgroundColor: theme.lightGray }]}>
  <View style={styles.airlineContainer}>
    <Image source={{ uri: flight.logo }} style={styles.airlineLogo} />
    <Text style={[styles.airlineName, { color: theme.black }]}>{flight.airline}</Text>
    <View style={[styles.flightNumberContainer, { backgroundColor: theme.white }]}>
      <Text style={styles.flightNumberText}>FL 2356</Text>
    </View>
  </View>

  <View style={styles.flightPathContainer}>
    <View style={styles.locationTimeContainer}>
      <Text style={[styles.timeText, { color: theme.black }]}>
        {new Date(flight.departureTime).toLocaleString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text style={[styles.locationText, { color: theme.black }]}>{flight.origin}</Text>
    </View>

    <View style={styles.durationContainer}>
      <Text style={[styles.durationText, { color: theme.black }]}>{flight.duration}</Text>
      <View style={styles.flightPath}>
        <View style={styles.dot} />
        <View style={styles.line} />
        {flight.stops > 0 && <View style={styles.stopDot} />}
        <View style={styles.dot} />
      </View>
      {flight.stops > 0 ? (
        <Text style={styles.stopsText}>{flight.stops} stop</Text>
      ) : (
        <Text style={styles.nonstopText}>Non stop</Text>
      )}
    </View>

    <View style={styles.locationTimeContainer}>
      <Text style={[styles.timeText, { color: theme.black }]}>
        {new Date(flight.arrivalTime).toLocaleString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text style={[styles.locationText, { color: theme.black }]}>{flight.destination}</Text>
    </View>
  </View>
</Card>


        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === "details" && styles.activeTabButton]}
            onPress={() => setSelectedTab("details")}
          >
            <Text style={[styles.tabText, selectedTab === "details" && styles.activeTabText]}>Flight Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === "passenger" && styles.activeTabButton]}
            onPress={() => setSelectedTab("passenger")}
          >
            <Text style={[styles.tabText, selectedTab === "passenger" && styles.activeTabText]}>Passenger Info</Text>
          </TouchableOpacity>
        </View>

        {selectedTab === "details" ? (
          <Card style={[styles.detailsCard, { backgroundColor: theme.lightGray }]}>
            <View style={styles.detailsSection}>
              <Text style={[styles.sectionTitle, {color: theme.black}]}>Flight Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Flight</Text>
                <Text style={[styles.detailValue, {color: theme.black}]}>{flight.airline} FL 2356</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Aircraft</Text>
                <Text style={[styles.detailValue, {color: theme.black}]}>Boeing 787-9</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Class</Text>
                <Text style={[styles.detailValue, {color: theme.black}]}>Economy</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={[styles.detailValue, {color: theme.black}]}>{flight.duration}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsSection}>
              <Text style={[styles.sectionTitle, {color: theme.black}]}>Baggage Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cabin</Text>
                <Text style={[styles.detailValue, {color: theme.black}]}>7kg</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Check-in</Text>
                <Text style={[styles.detailValue, {color: theme.black}]}>20kg</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsSection}>
              <Text style={[styles.sectionTitle, {color: theme.black}]}>Cancellation</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Refundable</Text>
                <Text style={[styles.detailValue, {color: theme.black}]}>Yes (Fee applies)</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel]}>Fee</Text>
                <Text style={[styles.detailValue, {color: theme.black}]}>$50</Text>
              </View>
            </View>
          </Card>
        ) : (
          <Card style={[styles.passengerCard, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionTitle, {color: theme.black}]}>Passenger Details</Text>

            <View style={styles.formContainer}>
              <Input
                label="First Name"
                placeholder="Enter first name"
                value={passengerDetails.firstName}
                onChangeText={(text) => setPassengerDetails({ ...passengerDetails, firstName: text })}
                autoCapitalize="words"
              />

              <Input
                label="Last Name"
                placeholder="Enter last name"
                value={passengerDetails.lastName}
                onChangeText={(text) => setPassengerDetails({ ...passengerDetails, lastName: text })}
                autoCapitalize="words"
              />

              <Input
                label="Date of Birth"
                placeholder="DD/MM/YYYY"
                value={passengerDetails.dob}
                onChangeText={(text) => setPassengerDetails({ ...passengerDetails, dob: text })}
                icon="calendar-outline"
              />

              <View style={styles.rowContainer}>
                <View style={styles.genderContainer}>
                  <Text style={[styles.inputLabel,{color:theme.black}]}>Gender</Text>
                  <View style={[styles.genderOptions]}>
                    <TouchableOpacity
                      style={[styles.genderOption, { backgroundColor: theme.white }, passengerDetails.gender === "Male" && styles.selectedGenderOption]}
                      onPress={() => setPassengerDetails({ ...passengerDetails, gender: "Male" })}
                    >
                      <Text
                        style={[styles.genderText, passengerDetails.gender === "Male" && styles.selectedGenderText, { color: theme.black }]}
                      >
                        Male
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderOption, { backgroundColor: theme.white }, passengerDetails.gender === "Female" && styles.selectedGenderOption]}
                      onPress={() => setPassengerDetails({ ...passengerDetails, gender: "Female" })}
                    >
                      <Text
                        style={[styles.genderText, passengerDetails.gender === "Female" && styles.selectedGenderText, { color: theme.black }]}
                      >
                        Female
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Input
                  label="Nationality"
                  placeholder="Country"
                  value={passengerDetails.nationality}
                  onChangeText={(text) => setPassengerDetails({ ...passengerDetails, nationality: text })}
                  style={{ flex: 1, marginLeft: 12 }}
                />
              </View>

              <Input
                label="Email"
                placeholder="Enter email address"
                value={passengerDetails.email}
                onChangeText={(text) => setPassengerDetails({ ...passengerDetails, email: text })}
                keyboardType="email-address"
                icon="mail-outline"
              />

              <Input
                label="Phone"
                placeholder="Enter phone number"
                value={passengerDetails.phone}
                onChangeText={(text) => setPassengerDetails({ ...passengerDetails, phone: text })}
                keyboardType="phone-pad"
                icon="call-outline"
              />

              <Text style={[styles.sectionTitle,{color: theme.black}, { marginTop: 24 }]}>Extra Options</Text>

              <View style={styles.optionsSection}>
                <Text style={[styles.optionLabel,{color: theme.black}]}>Meal Preference</Text>
                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={[styles.optionButton,{backgroundColor:theme.white}, selectedMeal === "Regular" && styles.selectedOptionButton]}
                    onPress={() => setSelectedMeal("Regular")}
                  >
                    <Text style={[styles.optionText,{color: theme.black}, selectedMeal === "Regular" && styles.selectedOptionText]}>
                      Regular
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.optionButton,{backgroundColor:theme.white},  selectedMeal === "Vegetarian" && styles.selectedOptionButton]}
                    onPress={() => setSelectedMeal("Vegetarian")}
                  >
                    <Text style={[styles.optionText,{color: theme.black}, selectedMeal === "Vegetarian" && styles.selectedOptionText]}>
                      Vegetarian
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.optionButton,{backgroundColor:theme.white},  selectedMeal === "Vegan" && styles.selectedOptionButton]}
                    onPress={() => setSelectedMeal("Vegan")}
                  >
                    <Text style={[styles.optionText,{color: theme.black}, selectedMeal === "Vegan" && styles.selectedOptionText]}>
                      Vegan
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.optionsSection}>
                <Text style={[styles.optionLabel,{color: theme.black}]}>Extra Baggage</Text>
                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={[styles.optionButton,{backgroundColor:theme.white},  selectedBaggage === "20kg" && styles.selectedOptionButton]}
                    onPress={() => setSelectedBaggage("20kg")}
                  >
                    <Text style={[styles.optionText,{color: theme.black}, selectedBaggage === "20kg" && styles.selectedOptionText]}>
                      20kg
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.optionButton,{backgroundColor:theme.white},  selectedBaggage === "25kg" && styles.selectedOptionButton]}
                    onPress={() => setSelectedBaggage("25kg")}
                  >
                    <Text style={[styles.optionText,{color: theme.black}, selectedBaggage === "25kg" && styles.selectedOptionText]}>
                      25kg (+$30)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.optionButton,{backgroundColor:theme.white},  selectedBaggage === "30kg" && styles.selectedOptionButton]}
                    onPress={() => setSelectedBaggage("30kg")}
                  >
                    <Text style={[styles.optionText,{color: theme.black},  selectedBaggage === "30kg" && styles.selectedOptionText]}>
                      30kg (+$50)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>
        )}

        <Card style={[styles.priceCard, { backgroundColor: theme.lightGray }]}>
          <Text style={[styles.sectionTitle, {color:theme.black}]}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base Fare</Text>
            <Text style={[styles.priceValue,{color:theme.black}]}>${totalPrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxes & Fees</Text>
            <Text style={[styles.priceValue,{color:theme.black}]}>$45</Text>
          </View>
          {selectedBaggage === "25kg" && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Extra Baggage (25kg)</Text>
              <Text style={[styles.priceValue,{color:theme.black}]}>$30</Text>
            </View>
          )}
          {selectedBaggage === "30kg" && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Extra Baggage (30kg)</Text>
              <Text style={[styles.priceValue,{color:theme.black}]}>$50</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, {color:theme.black}]}>Total</Text>
            <Text style={styles.totalValue}>
              ${totalPrice + 45 + (selectedBaggage === "25kg" ? 30 : selectedBaggage === "30kg" ? 50 : 0)}
            </Text>
          </View>
        </Card>

        <Button title="Proceed to Payment" onPress={handleProceedToPayment} gradient style={styles.paymentButton} />
      </ScrollView>
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
  flightSummaryCard: {
    marginBottom: 16,
  },
  airlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  airlineLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  airlineName: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.black,
    flex: 1,
  },
  flightNumberContainer: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  flightNumberText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  flightPathContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationTimeContainer: {
    alignItems: "center",
  },
  timeText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  locationText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.black,
    marginTop: 4,
  },
  dateText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  durationContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  durationText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 8,
  },
  flightPath: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary,
  },
  stopDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -3,
    marginLeft: -3,
  },
  stopsText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.secondary,
    marginTop: 8,
  },
  nonstopText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.success,
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightGray,
  },
  activeTabButton: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  detailsCard: {
    marginBottom: 16,
  },
  detailsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  detailValue: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.font,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 16,
  },
  passengerCard: {
    marginBottom: 16,
    borderWidth:1,
    borderColor: COLORS.lightGray,
  },
  formContainer: {
    marginTop: 8,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderContainer: {
    flex: 1,
    marginRight: 12,
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 8,
  },
  genderOptions: {
    flexDirection: "row",
    height: 56,
  },
  genderOption: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  genderOption: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  selectedGenderOption: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  genderText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.black,
  },
  selectedGenderText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
  },
  optionsSection: {
    marginTop: 16,
  },
  optionLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: COLORS.white,
  },
  selectedOptionButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  selectedOptionText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
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
  paymentButton: {
    marginBottom: 16,
  },
})

export default FlightDetailsScreen
