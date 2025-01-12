import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface OtpVerificationProps {
  onVerify: (otp: string) => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ onVerify }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<TextInput[]>(Array(6).fill(null));

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      Keyboard.dismiss();
      onVerify(otpString);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        We've sent a 6-digit code to your phone number
      </Text>

      <View style={styles.otpContainer}>
        {Array(6).fill(null).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => inputRefs.current[index] = ref}
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
          otp.join('').length !== 6 && styles.disabledButton,
        ]}
        onPress={handleVerify}
        disabled={otp.join('').length !== 6}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: '#DF2020',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
    color: '#DF2020',
  },
  verifyButton: {
    backgroundColor: '#DF2020',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OtpVerification;