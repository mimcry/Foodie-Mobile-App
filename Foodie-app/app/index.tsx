import { isLoggedInAtom } from "@/hooks/authAtom";
import { Redirect } from "expo-router";
import { useAtom } from "jotai";

export default function Index() {
  const [isLoggedIn] = useAtom(isLoggedInAtom); 
  
  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/signin" />;
  }
}
