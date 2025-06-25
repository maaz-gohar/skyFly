import { apiRequest } from "./config";

// Update user profile
export const updateUserProfile = async (userId: string, userData: any) => {
  return await apiRequest(`/users/update-user/${userId}`, "PUT", userData, true);
};


// Get user payment methods
export const getUserPaymentMethods = async () => {
  return await apiRequest("/users/payment-methods", "GET", null, true)
}

// Add payment method
export const addPaymentMethod = async (paymentMethodData: any) => {
  return await apiRequest("/users/payment-methods", "POST", paymentMethodData, true)
}

// Update travel preferences
export const updateTravelPreferences = async (preferencesData: any) => {
  return await apiRequest("/users/preferences", "PUT", preferencesData, true)
}

// Get frequent flyer programs
export const getFrequentFlyerPrograms = async () => {
  return await apiRequest("/users/frequent-flyer", "GET", null, true)
}

// Add frequent flyer program
export const addFrequentFlyerProgram = async (programData: any) => {
  return await apiRequest("/users/frequent-flyer", "POST", programData, true)
}
