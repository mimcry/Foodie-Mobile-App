import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
} from "react-native";
import { useAtom } from "jotai";
import { userEmail } from "@/hooks/authAtom";
import { router } from "expo-router";
interface OtpVerificationProps {
  onVerify: (otp: string) => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ onVerify }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<TextInput[]>(Array(6).fill(null));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [email] = useAtom(userEmail);
  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = async () => {
    setOtp(Array(6).fill(""));
    setTimeLeft(600);
    setIsTimerActive(true);

    try {
      const response = await fetch(`http://192.168.1.67:8000/api/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, // Send the email of the user to the backend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        ToastAndroid.show("OTP resent successfully", ToastAndroid.SHORT);
        router.push("/(auth)/signin")
      } else {
        ToastAndroid.show(
          data.error || "Failed to resend OTP",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      ToastAndroid.show(
        "An error occurred while resending OTP",
        ToastAndroid.SHORT
      );
    }
  };
  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };
  useEffect(() => {
    if (!isTimerActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive]);

  const handleSubmit = async () => {
    console.log("email", email);

    const otpString = otp.join("");

    console.log("Submitted OTP:", otpString);

    // Send OTP to the backend for verification
    try {
      const response = await fetch(`http://192.168.1.67:8000/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Replace with actual email from user data
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        ToastAndroid.show("OTP verified sucessfully.", ToastAndroid.SHORT);
        router.push("/(tabs)/home");
      } else {
        ToastAndroid.show(data.error, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      ToastAndroid.show(
        "An error occurred while verifying OTP",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        We've sent a 6-digit code to your phone number
      </Text>

      <View style={styles.otpContainer}>
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="number-pad"
              value={otp[index]}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
      </View>

      <TouchableOpacity
        style={[
          styles.verifyButton,
          otp.join("").length !== 6 && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={otp.join("").length !== 6}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      <View style={{marginTop:5}}>
        {isTimerActive ? (
          <Text >
            Time remaining: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </Text>
        ) : (
          <TouchableOpacity
            onPress={handleResend}
           
          >
        <Text style={{color:"#df2020",marginTop:5}}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 30,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: "#DF2020",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
    color: "#DF2020",
  },
  verifyButton: {
    backgroundColor: "#DF2020",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OtpVerification;
