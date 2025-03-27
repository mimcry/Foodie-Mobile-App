import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    console.log("Notification permission granted.");
  } else {
    console.log("Notification permission denied.");
  }
}

export async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.log("Error fetching FCM token:", error);
  }
}

export function setupNotificationListeners() {
  // Foreground notifications
  messaging().onMessage(async (remoteMessage) => {
    console.log("Foreground Notification:", remoteMessage);
    Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);
  });

  // Background notifications
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Background Notification:", remoteMessage);
  });
}
