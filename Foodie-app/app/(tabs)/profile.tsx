import React, { useEffect, useState  } from "react";
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
  Alert,
} from "react-native";
import { Camera,Mail,Phone,MapPin } from "lucide-react-native";
import { router } from "expo-router";
import handelTokenExpiry from "@/utils/handelRefresh";
import { useAtom } from "jotai";
import { accessTokenAtom, userIdAtom, userEmail } from "@/hooks/authAtom";
import * as ImagePicker from "expo-image-picker";
const Profile = () => {
  interface UserDetails {
    name: string |null;
    email: string|null;
    phone_number?:string|null;
    avatar?: string|null;
    address?: string|null;
  }

  const [userDetails, setUserDetails] = useState<UserDetails | null>({
    name: "",
    email: "",
    phone_number: "",
    avatar: "",
    address: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [access_token] = useAtom(accessTokenAtom);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [id] = useAtom(userIdAtom);

  const requestPermission = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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

  useEffect(() => {
    requestPermission();
  }, []);
  console.log("image uri",avatarUri)

  const handleAvatarChange = async () => {
    try {
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
  
        const response = await fetch(`http://192.168.1.67:8000/profile/${id}/avatar`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
  
        const responseData = await response.json();
  
        if (response.ok) {
          setAvatarUri(responseData.user.avatar);
          ToastAndroid.show("Avatar uploaded successfully", ToastAndroid.SHORT);
        } else {
          Alert.alert("Error", responseData.error);
        }
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      Alert.alert("Error", "Failed to upload avatar");
    }
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!access_token) {
          setError("No token found. Please log in again.");
          return;
        }

        const response = await fetch(`http://192.168.1.67:8000/profile/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (response.status === 401) {
          console.log("Token expired or invalid. Please log in again.");
          handelTokenExpiry();

          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }
        }

        const data = await response.json();
        setUserDetails(data);
        setEditedUser(data)
        setFormData(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user profile");
      }
    };

    fetchUserDetails();
  }, [id, access_token]);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
  
    avatar:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6692db04-404e-4d58-8c2c-bab7b56b9177/dg4vpqt-597328a9-9115-4cbf-9d32-c6194a8e80d9.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY2OTJkYjA0LTQwNGUtNGQ1OC04YzJjLWJhYjdiNTZiOTE3N1wvZGc0dnBxdC01OTczMjhhOS05MTE1LTRjYmYtOWQzMi1jNjE5NGE4ZTgwZDkuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Uats5toV7VzhM-NrAgf-XT007K73CJh-EfNokND9TUE",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(userDetails);

  console.log("user data", editedUser);
  const sections = [
    {
      title: "Account Settings",
      items: [
        { icon: "🔧", title: "Edit Profile" },
        { icon: "🔒", title: "Change Password" },
        { icon: "🔔", title: "Notifications" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "❓", title: "FAQ" },
        { icon: "🎮", title: "Help & Support" },
        { icon: "📖", title: "Terms & Conditions" },
        { icon: "🔒", title: "Privacy Policy" },
      ],
    },
  ];


  const handleLogout = () => {
    router.push("/(auth)/signin");
  };
  const handleSave = async () => {
    setIsEditing(false);
    try {
      const response = await fetch(`http://192.168.1.67:8000/profile/${id}`, {
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
  
      if (response.ok) {
        const result = await response.json();
  

        setUserDetails((prev) => ({
          ...prev,
          name: editedUser?.name ?? (prev?.name ||null),
          phone_number: editedUser?.phone_number ?? (prev?.phone_number ||null),
          address: editedUser?.address ?? (prev?.address ||null),
          email:  (prev?.email ||null),
        }));
  
        setEditedUser((prev) => ({
          ...prev,
          name: editedUser?.name ?? (prev?.name ||null),
          phone_number: editedUser?.phone_number ?? (prev?.phone_number ||null),
          address: editedUser?.address ?? (prev?.address ||null),
          email:(prev?.email ||null),
        }));
  
        ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
        router.push("/home");
      } else {
        const error = await response.json();
        ToastAndroid.show(error.error, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      ToastAndroid.show(
        "An error occurred. Please try again.",
        ToastAndroid.SHORT
      );
    }
  };
  const avatarUrl = `http://192.168.1.67:8000${userDetails?.avatar}`;
  const avatarUrl2 = `http://192.168.1.67:8000${avatarUri}`;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
      }}
    >
     <View
  style={{
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  }}
>
  <View
    style={{
      position: "relative",
      marginBottom: 10,
      borderColor: "#df2020",
      borderWidth: 2,
      borderRadius: 360,
    }}
  >
    <Image
   source={{ uri: avatarUrl || avatarUrl2 }}
      style={{
        width: 100,
        height: 100,
        borderRadius: 50,
      }}
    />
    <TouchableOpacity
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#df2020",
        padding: 8,
        borderRadius: 20,
      }}
      onPress={handleAvatarChange}
    >
      <Camera size={20} color="#fff" />
    </TouchableOpacity>
  </View>

  <Text
    style={{
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 5,
    }}
  >
    {userDetails?.name}
  </Text>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    }}
  >
    <Mail size={18} color="#df2020" style={{ marginRight: 8 }} />
    <Text
      style={{
        fontSize: 16,
        color: "#666",
      }}
    >
      {userDetails?.email}
    </Text>
  </View>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    }}
  >
    <Phone size={18} color="#df2020" style={{ marginRight: 8 }} />
    <Text
      style={{
        fontSize: 16,
        color: "#666",
      }}
    >
      {userDetails?.phone_number}
    </Text>
  </View>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    }}
  >
    <MapPin size={18} color="#df2020" style={{ marginRight: 8 }} />
    <Text
      style={{
        fontSize: 16,
        color: "#666",
      }}
    >
      {userDetails?.address || "Address not provided"}
    </Text>
  </View>

  <TouchableOpacity
    style={{
      backgroundColor: "#df2020",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    }}
    onPress={() => setIsEditing(true)}
  >
    <Text
      style={{
        color: "#fff",
        fontWeight: "600",
      }}
    >
      Edit Profile
    </Text>
  </TouchableOpacity>
</View>


      {sections.map((section, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#fff",
            marginTop: 20,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              paddingHorizontal: 15,
              marginBottom: 10,
            }}
          >
            {section.title}
          </Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 15,
              }}
              onPress={() => console.log(`Navigating to ${item.title}`)}
            >
              <Text
                style={{
                  fontSize: 20,
                  marginRight: 15,
                }}
              >
                {item.icon}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#333",
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity
        style={{
          marginVertical: 20,
          marginHorizontal: 15,
          backgroundColor: "#df2020",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={handleLogout}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditing}
          onRequestClose={() => setIsEditing(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 15,
                padding: 20,
                width: "90%",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Edit Profile
              </Text>
              <View
                style={{
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    marginBottom: 5,
                    color: "#666",
                  }}
                >
                  Name
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 16,
                  }}
                  value={editedUser?.name??"" }
                  onChangeText={(text) =>
                    setEditedUser((prev) =>
                      prev ? { ...prev, name: text } : { name: text }
                    )
                  }
                />
              </View>

              <View
                style={{
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    marginBottom: 5,
                    color: "#666",
                  }}
                >
                  Phone
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 16,
                  }}
                  value={editedUser?.phone_number ?? ""}
                  onChangeText={(text) =>
                    setEditedUser((prev) =>
                      prev ? { ...prev, phone_number: text } : { phone_number: text }
                    )
                  }
                  keyboardType="phone-pad"
                />
              </View>
              <View
                style={{
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    marginBottom: 5,
                    color: "#666",
                  }}
                >
                  Address
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 16,
                  }}
                  value={editedUser?.address ?? ""}
                  onChangeText={(text) =>
                    setEditedUser((prev) =>
                      prev ? { ...prev, address: text } : { address: text }
                    )
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: 15,
                    borderRadius: 8,
                    marginHorizontal: 5,
                    backgroundColor: "#FF3B30",
                  }}
                  onPress={() => setIsEditing(false)}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: 15,
                    borderRadius: 8,
                    marginHorizontal: 5,
                    backgroundColor: "green",
                  }}
                  onPress={handleSave}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

export default Profile;
