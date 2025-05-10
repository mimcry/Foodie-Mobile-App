import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ToastAndroid,
  RefreshControl,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Camera, Mail, Phone, MapPin, Edit2, LogOut, ChevronRight, User, Lock, Bell, HelpCircle, FileText, Shield } from "lucide-react-native";
import { router } from "expo-router";
import handelTokenExpiry from "@/utils/handelRefresh";
import { useAtom } from "jotai";
import { userIdAtom } from "@/hooks/authAtom";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccessToken } from "@/utils/access_Token";
import { userId } from "@/utils/id";

const Profile = () => {
  interface UserDetails {
    name: string | null;
    email: string | null;
    phone_number?: string | null;
    avatar?: string | null;
    address?: string | null;
  }

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>({
    name: "",
    email: "",
    phone_number: "",
    avatar: "",
    address: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(userDetails);
  const [id] = useAtom(userIdAtom);
  const BASE_URL = "http://192.168.1.70:8000";

  const sections = [
    {
      title: "Account Settings",
      items: [
        { icon: <User size={22} color="#555" />, title: "Edit Profile", action: () => setIsEditing(true) },
        { icon: <Lock size={22} color="#555" />, title: "Change Password", action: () => Alert.alert("Feature", "Change Password feature coming soon!") },
        { icon: <Bell size={22} color="#555" />, title: "Notifications", action: () => Alert.alert("Feature", "Notifications feature coming soon!") },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: <HelpCircle size={22} color="#555" />, title: "FAQ", action: () => Alert.alert("Feature", "FAQ feature coming soon!") },
        { icon: <HelpCircle size={22} color="#555" />, title: "Help & Support", action: () => Alert.alert("Feature", "Help & Support feature coming soon!") },
        { icon: <FileText size={22} color="#555" />, title: "Terms & Conditions", action: () => Alert.alert("Feature", "Terms & Conditions feature coming soon!") },
        { icon: <Shield size={22} color="#555" />, title: "Privacy Policy", action: () => Alert.alert("Feature", "Privacy Policy feature coming soon!") },
      ],
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserDetails();
    setRefreshing(false);
  };

  const requestPermission = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "This app needs access to your photo library to change the avatar."
        );
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  };

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const access_token = await getAccessToken();
      const id = await userId();
      
      if (!access_token) {
        setError("No token found. Please log in again.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/profile/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (response.status === 401) {
        console.log("Token expired or invalid.");
        handelTokenExpiry();
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setUserDetails(data);
      setEditedUser(data);
      await AsyncStorage.setItem("user image", data?.avatar ?? "");
      await AsyncStorage.setItem("user name", data?.name ?? "");
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to load user profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async () => {
    try {
      const access_token = await getAccessToken();
      const id = await userId();
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) return;

      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setAvatarUri(imageUri);
        
        const formData = new FormData();
        formData.append("avatar", {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'avatar.jpg'
        });

        if (!access_token) {
          console.log("No token found. Please log in again.");
          return;
        }

        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/profile/${id}/avatar`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (response.status === 401) {
          console.log("Token expired or invalid. Please log in again.");
          handelTokenExpiry();
          setIsLoading(false);
          return;
        }

        const responseData = await response.json();

        if (response.ok) {
          setAvatarUri(responseData.user.avatar);
          ToastAndroid.show("Avatar updated successfully", ToastAndroid.SHORT);
          await fetchUserDetails();
        } else {
          Alert.alert("Error", responseData.error || "Failed to update avatar");
        }
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      Alert.alert("Error", "Failed to upload avatar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const access_token = await getAccessToken();
      const id = await userId();
      
      const response = await fetch(`${BASE_URL}/profile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          name: editedUser?.name ?? "",
          phone_number: editedUser?.phone_number ?? "",
          address: editedUser?.address ?? "",
        }),
      });

      if (response.status === 401) {
        console.log("Token expired or invalid. Please log in again.");
        handelTokenExpiry();
        setIsLoading(false);
        setIsEditing(false);
        return;
      }

      if (response.ok) {
        await fetchUserDetails();
        ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
      } else {
        const error = await response.json();
        ToastAndroid.show(error.error || "Update failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      ToastAndroid.show(
        "An error occurred. Please try again.",
        ToastAndroid.SHORT
      );
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("isLoggedIn");
              await AsyncStorage.removeItem("userId");
              await AsyncStorage.removeItem("accessToken");
              await AsyncStorage.removeItem("refreshToken");
              
              ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
              router.push("/(auth)/signin");
            } catch (error) {
              console.error("Error during logout:", error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  useEffect(() => {
    requestPermission();
    fetchUserDetails();
  }, [id]);

  const avatarUrl = userDetails?.avatar;
  
  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#df2020" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <>
      
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#df2020"]}
              tintColor="#df2020"
            />
          }
        >
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {avatarUrl || avatarUri ? (
                <Image
                  source={{ uri: `${BASE_URL}${avatarUrl || avatarUri}` }}
                  style={styles.avatar}
                />
              ) : (
                <Image
                  source={require("@/image/avatar.jpg")}
                  style={styles.avatar}
                />
              )}
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleAvatarChange}
              >
                <Camera size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{userDetails?.name || "User"}</Text>

            <View style={styles.userInfoContainer}>
              <View style={styles.infoRow}>
                <Mail size={16} color="#df2020" style={styles.infoIcon} />
                <Text style={styles.infoText}>{userDetails?.email || "Email not available"}</Text>
              </View>

           <View style={{marginLeft:50}}>
           <View style={styles.infoRow}>
                <Phone size={16} color="#df2020" style={styles.infoIcon} />
                <Text style={styles.infoText}>{userDetails?.phone_number || "Phone not provided"}</Text>
              </View>
           </View>
           <View style={{marginLeft:60}}>
              <View style={styles.infoRow}>
                <MapPin size={16} color="#df2020" style={styles.infoIcon} />
                <Text style={styles.infoText}>{userDetails?.address || "Address not provided"}</Text>
              </View> </View>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Edit2 size={16} color="#fff" style={styles.editIcon} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Sections */}
          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.menuItem}
                  onPress={item.action}
                >
                  <View style={styles.menuItemLeft}>
                    {item.icon}
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <ChevronRight size={18} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color="#fff" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>App Version 1.0.0</Text>
          </View>
        </ScrollView>

        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditing}
          onRequestClose={() => setIsEditing(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser?.name ?? ""}
                  onChangeText={(text) =>
                    setEditedUser((prev) =>
                      prev ? { ...prev, name: text } : { name: text }
                    )
                  }
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser?.phone_number ?? ""}
                  onChangeText={(text) =>
                    setEditedUser((prev) =>
                      prev ? { ...prev, phone_number: text } : { phone_number: text }
                    )
                  }
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser?.address ?? ""}
                  onChangeText={(text) =>
                    setEditedUser((prev) =>
                      prev ? { ...prev, address: text } : { address: text }
                    )
                  }
                  placeholder="Enter your address"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#df2020",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#df2020",
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  userInfoContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems:"center"
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    textAlign:"center",
    justifyContent:"center",
    alignSelf:"center",
    marginLeft:60
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 15,
    color: "#666",
    flex: 1,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#df2020",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 2,
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#df2020",
    marginHorizontal: 15,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 2,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    color: "#999",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 5,
    color: "#666",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#df2020",
  },
  modalButtonText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
});

export default Profile;