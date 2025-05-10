import { useState, useEffect } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import requestUserPermission from "@/components/requestuserpermission";
import messaging from '@react-native-firebase/messaging';
import { Alert } from "react-native";
export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userData, setUserData] = useState(null); 
useEffect(()=>{
  requestUserPermission();

},[])
const getFCMToken = async () => {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
};

useEffect(() => {
  getFCMToken();
  
}, []);
useEffect(() => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);
  });

  return unsubscribe;
}, []);

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const loginState = await AsyncStorage.getItem("isLoggedIn");
        const userId = await AsyncStorage.getItem("userId");
        const accessToken = await AsyncStorage.getItem("accessToken");

        if (loginState === "true" && userId && accessToken) {
          setIsLoggedIn(true);
          setUserData({ userId, accessToken });
        } else {
          setIsLoggedIn(false);
          setUserData(null); // If not logged in, reset user data
        }
      } catch (error) {
        console.error("Error checking login state:", error);
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };

    checkLoginState();
  }, []);

  if (isLoading) {
    return null; // Or loading spinner
  }

  if (isLoggedIn) {
    // User is logged in, redirect to home page
    return <Redirect href="/(tabs)/home" />;
  } else {
    // User is not logged in, redirect to sign-in page
    return <Redirect href="/(auth)/signin" />;
  }
}
