import { LinearGradient } from "expo-linear-gradient"
import type React from "react"
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TextStyle,
  type TouchableOpacityProps,
  type ViewStyle,
} from "react-native"
import { COLORS, FONTS, SIZES } from "../constants/theme"

interface ButtonProps extends TouchableOpacityProps {
  title: string
  gradient?: boolean
  outlined?: boolean
  loading?: boolean
  textStyle?: TextStyle
  style?: ViewStyle
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  gradient = false,
  outlined = false,
  loading = false,
  disabled = false,
  ...props
}) => {
  if (gradient) {
    return (
      <TouchableOpacity style={[styles.container, style]} onPress={onPress} disabled={loading || disabled} {...props}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={[styles.text, textStyle]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  if (outlined) {
    return (
      <TouchableOpacity
        style={[styles.outlinedContainer, style]}
        onPress={onPress}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : (
          <Text style={[styles.outlinedText, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: COLORS.primary }, style]}
      onPress={onPress}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} size="small" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    height: "100%",
    width: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontFamily: FONTS.semiBold,
  },
  outlinedContainer: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
  },
  outlinedText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    fontFamily: FONTS.semiBold,
  },
})

export default Button
