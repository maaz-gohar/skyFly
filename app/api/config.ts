import AsyncStorage from "@react-native-async-storage/async-storage"

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

    const isFormData = data instanceof FormData
    const headers: Record<string, string> = {}

    // Add Content-Type only if not FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }

    // Add auth token if required
    if (requireAuth) {
      const token = await AsyncStorage.getItem("token")
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
        console.log("🔑 Authorization header added")
      } else {
        throw new Error("Authentication required. Please log in again.")
      }
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (data && method !== "GET") {
      config.body = isFormData ? data : JSON.stringify(data)
      console.log("📤 Request body:", isFormData ? "[FormData]" : data)
    }

    const response = await fetch(url, config)
    const contentType = response.headers.get("content-type")

    let responseData: any
    if (contentType?.includes("application/json")) {
      responseData = await response.json()
    } else {
      const text = await response.text()
      responseData = { message: text }
    }

    if (!response.ok) {
      const errorMessage =
        responseData?.message || responseData?.error || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    return {
      success: true,
      data: responseData.data || responseData,
      message: responseData.message,
    }
  } catch (error: any) {
    console.error("❌ API Request failed:", error)

    if (error instanceof Error) {
      if (error.message.includes("Network")) {
        throw new Error("Network error. Please check your internet connection.")
      }
      if (error.message.includes("401") || error.message.includes("Authentication")) {
        throw new Error("Authentication required. Please log in again.")
      }
      if (error.message.includes("403")) {
        throw new Error("Access denied.")
      }

      throw error
    }

    throw new Error("An unexpected error occurred.")
  }
}
