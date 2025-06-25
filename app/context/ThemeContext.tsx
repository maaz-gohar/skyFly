"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import { COLORS, COLORS_DARK } from "../constants/theme"

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
  theme: typeof COLORS
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme()
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === "dark")

  useEffect(() => {
    // Load theme preference from storage
    const loadThemePreference = async () => {
      try {
        const themePreference = await AsyncStorage.getItem("themePreference")
        if (themePreference !== null) {
          setIsDarkMode(themePreference === "dark")
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error)
      }
    }

    loadThemePreference()
  }, [])

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode
      setIsDarkMode(newTheme)
      await AsyncStorage.setItem("themePreference", newTheme ? "dark" : "light")
    } catch (error) {
      console.error("Failed to save theme preference:", error)
    }
  }

  // Get the appropriate theme colors based on mode
  const theme = isDarkMode ? COLORS_DARK : COLORS

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
