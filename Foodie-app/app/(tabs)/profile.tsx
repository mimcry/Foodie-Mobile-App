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
} from "react-native";
import { Camera } from "lucide-react-native";
import { router } from "expo-router";
const Profile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    avatar:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6692db04-404e-4d58-8c2c-bab7b56b9177/dg4vpqt-597328a9-9115-4cbf-9d32-c6194a8e80d9.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY2OTJkYjA0LTQwNGUtNGQ1OC04YzJjLWJhYjdiNTZiOTE3N1wvZGc0dnBxdC01OTczMjhhOS05MTE1LTRjYmYtOWQzMi1jNjE5NGE4ZTgwZDkuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Uats5toV7VzhM-NrAgf-XT007K73CJh-EfNokND9TUE",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

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

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    router.push("/(auth)/signin")
  };
  
    
  

  const EditModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isEditing}
      onRequestClose={() => setIsEditing(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={editedUser.name}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, name: text })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={editedUser.phone}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, phone: text })
              }
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.phone}>{user.phone}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              style={styles.menuItem}
              onPress={() => console.log(`Navigating to ${item.title}`)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <EditModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
    borderColor: "#df2020",
    borderWidth: 2,
    borderRadius: 360,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#df2020",
    padding: 8,
    borderRadius: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#df2020",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#dfff",
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginVertical: 20,
    marginHorizontal: 15,
    backgroundColor: "#df2020",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  saveButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Profile;
