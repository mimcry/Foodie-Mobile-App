
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

export default function Layout() {

  return (
    <Stack>
     
      <Stack.Screen name="search_page" options={{ headerShown: false }} />
      
    </Stack>
  );
}

