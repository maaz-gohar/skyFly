"use client"

import type React from "react"

import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View, type TextInputProps, type ViewStyle } from "react-native"
import { COLORS, FONTS, SIZES } from "../constants/theme"

interface InputProps extends TextInputProps {
  label?: string
  icon?: keyof typeof Ionicons.glyphMap
  error?: string
  containerStyle?: ViewStyle
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  icon,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const { theme } = useTheme()

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, {color: theme.black}]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
         { backgroundColor: theme.background }
        ]}
      >
        {icon && (
          <Ionicons name={icon} size={20} color={isFocused ? COLORS.primary : COLORS.gray} style={styles.icon} />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
            <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
    flex: 1,
    width: "100%",
    paddingHorizontal: SIZES.base,
  },
  label: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    // color: COLORS.secondaryLight,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  focusedInput: {
    borderColor: COLORS.primary,
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
    
  },
  icon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    marginTop: 5,
  },
})

export default Input
