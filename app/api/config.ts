import AsyncStorage from "@react-native-async-storage/async-storage"

// Update this to your backend URL
export const API_BASE_URL = "http://192.168.18.164:5000/api"

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export const apiRequest = async <T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  data?: any,
  requireAuth = false,
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    console.log(`🌐 API Request: ${method} ${url}`)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Add authentication header if required
    if (requireAuth) {
      try {
        const token = await AsyncStorage.getItem("token")
        console.log("🔑 Token retrieved:", token ? "Token exists" : "No token found")

        if (token) {
          headers.Authorization = `Bearer ${token}`
          console.log("🔑 Authorization header added")
        } else {
          console.warn("⚠️ No token found but auth required")
          throw new Error("Authentication required. Please log in again.")
        }
      } catch (tokenError) {
        console.error("❌ Token retrieval error:", tokenError)
        throw new Error("Authentication error. Please log in again.")
      }
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (data && (method === "POST" || method === "PUT")) {
      config.body = JSON.stringify(data)
      console.log("📤 Request body:", data)
    }

    console.log("📋 Request headers:", headers)

    const response = await fetch(url, config)
    console.log(`📡 Response status: ${response.status} ${response.statusText}`)

    let responseData: any
    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json()
    } else {
      const textData = await response.text()
      console.log("📄 Non-JSON response:", textData)
      responseData = { message: textData }
    }

    console.log("📥 Response data:", responseData)

    if (!response.ok) {
      const errorMessage =
        responseData?.message || responseData?.error || `HTTP ${response.status}: ${response.statusText}`
      console.error("❌ API Error:", errorMessage)
      throw new Error(errorMessage)
    }

    return {
      success: true,
      data: responseData.data || responseData,
      message: responseData.message,
    }
  } catch (error) {
    console.error("❌ API Request failed:", error)

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes("Network request failed") || error.message.includes("fetch")) {
        throw new Error("Network error. Please check your internet connection and try again.")
      }
      if (error.message.includes("401") || error.message.includes("Authentication")) {
        throw new Error("Authentication required. Please log in again.")
      }
      if (error.message.includes("403")) {
        throw new Error("Access denied. You don't have permission to perform this action.")
      }
      throw error
    }

    throw new Error("An unexpected error occurred. Please try again.")
  }
}
