



import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      console.log("No token found. Please log in again.");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};