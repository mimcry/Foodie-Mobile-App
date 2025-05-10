import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export default function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    async function registerForPushNotifications() {
      if (Device.isDevice) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission for notifications denied!");
          return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
        console.log("Expo Push Token:", token);
      }
    }

    registerForPushNotifications();

    return () => {
      Notifications.setNotificationHandler(null);
    };
  }, []);

  return expoPushToken;
}
