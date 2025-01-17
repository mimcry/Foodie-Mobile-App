import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid,
} from "react-native";
import {
  isLoggedInAtom,
  userIdAtom,
  accessTokenAtom,
  refreshTokenAtom,
} from "@/hooks/authAtom";
import { useAtom } from "jotai";
import { router } from "expo-router";
const SignIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [userId, setUserId] = useAtom(userIdAtom);
  const [accesstoken, setAccessToken] = useAtom(accessTokenAtom);
  const [, setRefreshToken] = useAtom(refreshTokenAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSignIn = async () => {
    setIsLoading(true);
    const data = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch("http://192.168.1.67:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        setUserId(result.userId);
        setIsLoggedIn(true);

        setAccessToken(result.accessToken);

        setRefreshToken(result.refreshToken);
        ToastAndroid.show("Login successfull", ToastAndroid.SHORT);
        router.push("/(tabs)/home");
      } else {
        const erroe = await response.json();
        ToastAndroid.show("Error occured", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(
        "An error occurred. Please try again.",
        ToastAndroid.SHORT
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View style={{ alignItems: "center", marginTop: 60, marginBottom: 40 }}>
          <Image
            source={require("@/image/logo.png")} // Replace with your logo path
            style={{ width: 200, height: 80 }}
            resizeMode="contain"
          />
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          Welcome Back!
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>
            Email
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 15,
              fontSize: 16,
              backgroundColor: "#f5f5f5",
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>
            Password
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 15,
              fontSize: 16,
              backgroundColor: "#f5f5f5",
            }}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#df2020",
            borderRadius: 10,
            padding: 16,
            alignItems: "center",
            marginTop: 10,
          }}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
            {isLoading ? "Logging in ..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: 20,
            alignItems: "center",
          }}
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text style={{ color: "#FF4B4B", fontSize: 16, fontWeight: "500" }}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
