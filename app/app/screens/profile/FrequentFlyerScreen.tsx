"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import Input from "../../../components/Input"
import { COLORS, FONTS, SIZES } from "../../../constants/theme"
import { useTheme } from "../../../context/ThemeContext"
import type { ScreenNavigationProp } from "../../../types"

interface FrequentFlyerScreenProps {
  navigation: ScreenNavigationProp<"FrequentFlyer">
}

interface FrequentFlyerProgram {
  id: string
  airline: string
  membershipNumber: string
  tier: string
  miles: number
}

const FrequentFlyerScreen: React.FC<FrequentFlyerScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()
  const [programs, setPrograms] = useState<FrequentFlyerProgram[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProgram, setNewProgram] = useState({
    airline: "",
    membershipNumber: "",
    tier: "Bronze",
  })

  useEffect(() => {
    // Mock data for demonstration
    setPrograms([
      {
        id: "1",
        airline: "Delta Airlines",
        membershipNumber: "DL123456789",
        tier: "Gold",
        miles: 45000,
      },
      {
        id: "2",
        airline: "United Airlines",
        membershipNumber: "UA987654321",
        tier: "Silver",
        miles: 28000,
      },
    ])
  }, [])

  const handleAddProgram = () => {
    if (!newProgram.airline || !newProgram.membershipNumber) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const program: FrequentFlyerProgram = {
      id: Date.now().toString(),
      ...newProgram,
      miles: 0,
    }

    setPrograms([...programs, program])
    setNewProgram({ airline: "", membershipNumber: "", tier: "Bronze" })
    setShowAddForm(false)
    Alert.alert("Success", "Frequent flyer program added successfully")
  }

  const handleDeleteProgram = (id: string) => {
    Alert.alert("Delete Program", "Are you sure you want to delete this frequent flyer program?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          setPrograms(programs.filter((program) => program.id !== id))
        },
        style: "destructive",
      },
    ])
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "#FFD700"
      case "Silver":
        return "#C0C0C0"
      case "Platinum":
        return "#E5E4E2"
      default:
        return "#CD7F32"
    }
  }

  const renderProgram = ({ item }: { item: FrequentFlyerProgram }) => (
    <Card style={[styles.programCard, { backgroundColor: theme.white }]}>
      <View style={styles.programHeader}>
        <View style={styles.programInfo}>
          <Text style={[styles.airlineName, { color: theme.black }]}>{item.airline}</Text>
          <Text style={[styles.membershipNumber, { color: theme.gray }]}>{item.membershipNumber}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProgram(item.id)}>
          <Ionicons name="trash-outline" size={20} color={theme.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.programDetails}>
        <View style={styles.tierContainer}>
          <View style={[styles.tierBadge, { backgroundColor: getTierColor(item.tier) }]}>
            <Text style={styles.tierText}>{item.tier}</Text>
          </View>
        </View>
        <View style={styles.milesContainer}>
          <Text style={[styles.milesLabel, { color: theme.gray }]}>Miles</Text>
          <Text style={[styles.milesValue, { color: theme.black }]}>{item.miles.toLocaleString()}</Text>
        </View>
      </View>
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
        <Text style={[styles.headerTitle, { color: theme.black }]}>Frequent Flyer Programs</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Ionicons name={showAddForm ? "close" : "add"} size={24} color={theme.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {showAddForm && (
          <Card style={[styles.addFormCard, { backgroundColor: theme.white }]}>
            <Text style={[styles.formTitle, { color: theme.black }]}>Add New Program</Text>

            <Input
              label="Airline"
              placeholder="Enter airline name"
              value={newProgram.airline}
              onChangeText={(text) => setNewProgram({ ...newProgram, airline: text })}
              icon="airplane-outline"
            />

            <Input
              label="Membership Number"
              placeholder="Enter membership number"
              value={newProgram.membershipNumber}
              onChangeText={(text) => setNewProgram({ ...newProgram, membershipNumber: text })}
              icon="card-outline"
            />

            <View style={styles.tierSelector}>
              <Text style={[styles.tierLabel, { color: theme.black }]}>Tier</Text>
              <View style={styles.tierOptions}>
                {["Bronze", "Silver", "Gold", "Platinum"].map((tier) => (
                  <TouchableOpacity
                    key={tier}
                    style={[
                      styles.tierOption,
                      {
                        backgroundColor: newProgram.tier === tier ? `${theme.primary}20` : theme.lightGray,
                        borderColor: newProgram.tier === tier ? theme.primary : "transparent",
                      },
                    ]}
                    onPress={() => setNewProgram({ ...newProgram, tier })}
                  >
                    <Text
                      style={[
                        styles.tierOptionText,
                        {
                          color: newProgram.tier === tier ? theme.primary : theme.gray,
                          fontFamily: newProgram.tier === tier ? FONTS.semiBold : FONTS.regular,
                        },
                      ]}
                    >
                      {tier}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button title="Add Program" onPress={handleAddProgram} gradient style={styles.addProgramButton} />
          </Card>
        )}

        <FlatList
          data={programs}
          renderItem={renderProgram}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.programsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="airplane-outline" size={64} color={theme.gray} />
              <Text style={[styles.emptyText, { color: theme.gray }]}>No frequent flyer programs added</Text>
              <Text style={[styles.emptySubtext, { color: theme.gray }]}>
                Add your frequent flyer programs to earn and track miles
              </Text>
            </View>
          }
        />
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
    flex: 1,
    textAlign: "center",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  addFormCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    marginBottom: 16,
  },
  tierSelector: {
    marginBottom: 16,
  },
  tierLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginBottom: 8,
  },
  tierOptions: {
    flexDirection: "row",
    gap: 8,
  },
  tierOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  tierOptionText: {
    fontSize: SIZES.small,
  },
  addProgramButton: {
    marginTop: 8,
  },
  programsList: {
    marginTop: 8,
  },
  programCard: {
    marginBottom: 16,
  },
  programHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  programInfo: {
    flex: 1,
  },
  airlineName: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.font,
  },
  membershipNumber: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  programDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tierContainer: {
    flex: 1,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  tierText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.small,
    color: "#000",
  },
  milesContainer: {
    alignItems: "flex-end",
  },
  milesLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
  },
  milesValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
  },
})

export default FrequentFlyerScreen
