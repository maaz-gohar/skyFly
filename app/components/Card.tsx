import type React from "react"
import { StyleSheet, View, type ViewStyle } from "react-native"
import { COLORS, SHADOWS } from "../constants/theme"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.medium,
  },
})

export default Card
