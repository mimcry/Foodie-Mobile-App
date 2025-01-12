
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

export default function Layout() {

  return (
    <Stack>
      {/* <Stack.Screen name="welcome" options={{ headerShown: false }} /> */}
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="signin" options={{ headerShown: false}} />
      <Stack.Screen name="otpVerification" options={{ headerShown: false}} />
      {/* <Stack.Screen name="forgot-password" options={{ headerShown: false }} />  */}
    </Stack>
  );
}

