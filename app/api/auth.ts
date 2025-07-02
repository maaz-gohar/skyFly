import { apiRequest } from "./config"

interface SignupData {
  name: string
  email: string
  phone: string
  address: string
  city?: string
  country?: string
  password: string
  confirmPassword?: string
  avatar?: {
    uri: string
    name: string
    type: string
  }
}


export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: {
    _id: string
    name: string
    email: string
    phone: string
    role: string
    address: string
    city: string
    country: string
    token: string
    avatar?: File // Optional, may not be present in all responses
  }
}

// Register a new user
// Register a new user
export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  const formData = new FormData()

  formData.append("name", userData.name)
  formData.append("email", userData.email)
  formData.append("password", userData.password)
  formData.append("phone", userData.phone)
  formData.append("address", userData.address)

  // These optional fields should still be sent if present
  if (userData.city) formData.append("city", userData.city)
  if (userData.country) formData.append("country", userData.country)

  // Only attach the avatar if it's provided
  if (userData.avatar) {
    formData.append("avatar", userData.avatar)
  }

  // confirmPassword is only used for frontend validation; skip it from sending
  return await apiRequest("/auth/signup", "POST", formData)
}


// Login user
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  return await apiRequest("/auth/login", "POST", credentials)
}

// Get current user profile
export const getCurrentUser = async (): Promise<any> => {
  return await apiRequest("/auth/me", "GET", null, true)
}
