"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { login as apiLogin, signup as apiSignup, getCurrentUser } from "../api/auth"

interface User {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  avatar: string // Optional, handled gracefully
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    phone: string,
    address: string,
    city: string,
    country: string,
    avatar: File  // Optional, may be used for profile picture upload
  ) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateUser: (newUserData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      console.log("🔄 Loading user from storage...")
      const storedToken = await AsyncStorage.getItem("token")
      const storedUserId = await AsyncStorage.getItem("userId")
      console.log("🔑 Stored token:", storedToken ? "Token found" : "No token")
      console.log("🆔 Stored userId:", storedUserId || "No user ID")

      if (storedToken) {
        setToken(storedToken)
        console.log("🔄 Getting current user...")

        try {
          const response = await getCurrentUser()
          console.log("👤 Current user response:", response)

          if (response.success && response.data) {
            setUser(response.data)
            console.log("✅ User loaded successfully:", response.data)
          } else {
            console.warn("⚠️ Invalid user response, clearing token")
            await AsyncStorage.removeItem("token")
            await AsyncStorage.removeItem("userId")
            setToken(null)
          }
        } catch (userError) {
          console.error("❌ Failed to get current user:", userError)
          await AsyncStorage.removeItem("token")
          await AsyncStorage.removeItem("userId")
          setToken(null)
        }
      }
    } catch (error) {
      console.error("❌ Failed to load user:", error)
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("userId")
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("🔐 Attempting login for:", email)
      const response = await apiLogin({ email, password })
      console.log("✅ Login response:", response)

      if (response.success && response.data) {
        const { token: newToken, ...userData } = response.data

        if (newToken) {
          await AsyncStorage.setItem("token", newToken)
          await AsyncStorage.setItem("userId", userData._id)

          setToken(newToken)
          setUser(userData)
          console.log("✅ Login successful, user set:", userData)
        } else {
          throw new Error("No token received from server")
        }
      } else {
        throw new Error((response as any).message || "Login failed")
      }
    } catch (error) {
      console.error("❌ Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    phone: string,
    address: string,
    city: string,
    country: string,
    avatar?: File  // Optional, may be used for profile picture upload
  ) => {
    setIsLoading(true)
    try {
      console.log("📝 Attempting signup for:", email)
      const response = await apiSignup({
        name,
        email,
        password,
        confirmPassword,
        phone,
        address,
        city,
        country,
        avatar,  // Optional, may be used for profile picture upload
      })
      console.log("✅ Signup response:", response)

      if (response.success && response.data) {
        const { token: newToken, ...userData } = response.data

        if (newToken) {
          await AsyncStorage.setItem("token", newToken)
          await AsyncStorage.setItem("userId", userData._id)

          setToken(newToken)
          setUser(userData)
          console.log("✅ Signup successful, user set:", userData)
        } else {
          throw new Error("No token received from server")
        }
      } else {
        throw new Error((response as any).message || "Signup failed")
      }
    } catch (error) {
      console.error("❌ Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      console.log("🚪 Logging out...")
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("userId")
      setToken(null)
      setUser(null)
      console.log("✅ Logout successful")
    } catch (error) {
      console.error("❌ Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    if (!token) return
    try {
      console.log("🔄 Refreshing user data...")
      const response = await getCurrentUser()
      if (response.success && response.data) {
        setUser(response.data)
        console.log("✅ User refreshed:", response.data)
      }
    } catch (error) {
      console.error("❌ Failed to refresh user:", error)
    }
  }

  const updateUser = (newUserData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser
      return {
        ...prevUser,
        ...newUserData,
      }
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
