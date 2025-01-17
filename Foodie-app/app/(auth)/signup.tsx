import React, { useEffect, useState } from "react";
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
import { router } from "expo-router";
import { useAtom } from "jotai";
import { userEmail } from "@/hooks/authAtom";
interface Signin {
    name?:String;
    email?:string;
    passweord?:string;
    confirmpassword?:string
}
const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [email,setEmail]=useAtom(userEmail)
  const handleSignUp = () => {
    console.log("Signing up with:", formData);
  };
  const onSubmit = async () => {
    setIsLoading(true);
    console.log("Signing up with:", email);
    setEmail(formData.email)

    try {
      const response = await fetch("http://192.168.1.67:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
        
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Signup successful:", result);
        ToastAndroid.show("Signup successful", ToastAndroid.SHORT);
       
        // Navigate to OTP verification screen
        router.push("/(auth)/otpVerification");
      } else {
        const error = await response.json();

      
        ToastAndroid.show(error.error, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      ToastAndroid.show("An error occurred. Please try again.", ToastAndroid.SHORT);
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
          Create Account
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>
            Full Name
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
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

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
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
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
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>
            Confirm Password
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
            placeholder="Confirm your password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
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
          disabled={isLoading}
          onPress={onSubmit}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          {isLoading ? "Signing Up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: 20,
            alignItems: "center",
          }}
          onPress={() => router.push("/(auth)/signin")}
        >
          <Text style={{ color: "#FF4B4B", fontSize: 16, fontWeight: "500" }}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
