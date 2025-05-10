import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import {
  BadgeIndianRupee,
  Utensils,
  Tag,
  FileText,
  Hash,
  ImagePlus,
  Clock,
  Flame,
  ChevronRight,
} from "lucide-react-native";
import { getAccessToken } from "@/utils/access_Token";
import { userId } from "@/utils/id";

const addfood = () => {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState([]);
  const [foodImage, setFoodImage] = useState(null);
  
  const predefinedTags = [
    "Pizza",
    "Burger",
    "Vegan",
    "Desert",
    "Drinks",
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setFoodImage(imageUri);
    }
  };

  const handleAddFood = async () => {
    if (!foodImage) {
      ToastAndroid.show("Please select a food image", ToastAndroid.SHORT);
      return;
    }

    if (!foodName || !price) {
      ToastAndroid.show("Food name and price are required", ToastAndroid.SHORT);
      return;
    }

    const formData = new FormData();
    formData.append("foodname", foodName);
    formData.append("price", price);
    formData.append("offer", offer);
    formData.append("description", description);
    formData.append("calories", calories);
    formData.append("duration", duration);
    formData.append("tags", tags.join(", "));
    formData.append("image", {
      uri: foodImage,
      type: "image/jpeg",
      name: "foodimage.jpg",
    });
    
    try {
      const access_token = await getAccessToken();

      const response = await fetch(
        "http://192.168.1.70:8000/fooddetails/food",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        ToastAndroid.show(
          `${foodName} was added successfully`,
          ToastAndroid.SHORT
        );
        // Reset form
        setFoodName("");
        setPrice("");
        setDescription("");
        setOffer("");
        setTags([]);
        setCalories("");
        setDuration("");
        setFoodImage(null);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        ToastAndroid.show(errorData.error, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Network error:", error);
      ToastAndroid.show("Network Error", ToastAndroid.SHORT);
    }
  };

  const toggleTagSelection = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const InputField = ({ icon, placeholder, value, onChangeText, keyboardType = "default" }) => (
    <View style={styles.inputContainer}>
      {icon}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add New Dish</Text>
          <Text style={styles.headerSubtitle}>Create a new food item for your menu</Text>
        </View>

        {/* Food Image Picker */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {foodImage ? (
              <Image source={{ uri: foodImage }} style={styles.foodImage} />
            ) : (
              <View style={styles.imagePickerPlaceholder}>
                <ImagePlus size={40} color="#df2020" />
                <Text style={styles.imagePickerText}>Upload Food Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {/* Food Name Input */}
          <InputField
            icon={<Utensils size={20} color="#df2020" />}
            placeholder="Food Name"
            value={foodName}
            onChangeText={setFoodName}
          />

          {/* Price and Offer in one row */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <BadgeIndianRupee size={20} color="#df2020" />
              <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Tag size={20} color="#df2020" />
              <TextInput
                style={styles.input}
                placeholder="Offer (%)"
                keyboardType="numeric"
                value={offer}
                onChangeText={setOffer}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Description Input */}
          <InputField
            icon={<FileText size={20} color="#df2020" />}
            placeholder="Food Description"
            value={description}
            onChangeText={setDescription}
          />

          {/* Calories and Duration in one row */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Flame size={20} color="#df2020" />
              <TextInput
                style={styles.input}
                placeholder="Calories"
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Clock size={20} color="#df2020" />
              <TextInput
                style={styles.input}
                placeholder="Prep Time (min)"
                keyboardType="numeric"
                value={duration}
                onChangeText={setDuration}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Tags Section */}
          <Text style={styles.sectionTitle}>Food Categories</Text>
          <View style={styles.tagsContainer}>
            {predefinedTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagButton,
                  tags.includes(tag) && styles.tagButtonSelected,
                ]}
                onPress={() => toggleTagSelection(tag)}
              >
                <Text
                  style={[
                    styles.tagText,
                    tags.includes(tag) && styles.tagTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleAddFood}>
          <Text style={styles.submitButtonText}>Add to Menu</Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    marginVertical: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  imagePickerContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  imagePicker: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderStyle: "dashed",
  },
  imagePickerPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },
  foodImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tagButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagButtonSelected: {
    backgroundColor: "#df2020",
  },
  tagText: {
    fontSize: 14,
    color: "#666",
  },
  tagTextSelected: {
    color: "#fff",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#df2020",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default addfood;