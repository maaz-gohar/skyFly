import { TokenCache } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐\n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("secure store get item error: ", error);
        await SecureStore.deleteItemAsync(key); // Clean up corrupted item
        return null;
      }
    },

    saveToken: async (key: string, value: string) => {
      try {
        await SecureStore.setItemAsync(key, value);
        console.log(`${key} saved successfully ✅`);
      } catch (error) {
        console.error("secure store save error: ", error);
      }
    },

    deleteToken: async (key: string) => {
      try {
        await SecureStore.deleteItemAsync(key);
        console.log(`${key} deleted ❌`);
      } catch (error) {
        console.error("secure store delete error: ", error);
      }
    },
  };
};

export default createTokenCache;
