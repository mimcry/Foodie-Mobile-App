import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import {
  BadgeIndianRupee,
  Utensils,
  Tag,
  FileText,
  Hash,
  ImagePlus,
} from "lucide-react-native";
import { getAccessToken } from "@/utils/access_Token";
import { userId } from "@/utils/id";
const Menu = () => {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [foodImage, setFoodImage] = useState<string | null>(null);
  const predefinedTags = [
    "Pizza",
    "Burger",
    "Fast Food",
    "Coffee",
    "Vegan",
    "Spicy",
  ];
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setFoodImage(imageUri);
    }
  };

  const handleAddFood = async () => {
    const formData = new FormData();
    formData.append("foodname", foodName);
    formData.append("price", price);
    formData.append("offer", offer);
    formData.append("description", description);
    formData.append("tags", tags.join(", "));
    formData.append("image", {
      uri: foodImage,
      type: "image/jpeg",
      name: "foodimage.jpg",
    });
    if (!foodImage) {
      ToastAndroid.show("Please Select Food Image", ToastAndroid.SHORT);
    }
    try {
      const access_token = await getAccessToken();

      const response = await fetch(
        "http://192.168.1.67:8000/fooddetails/food",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access_token}`, // Only Authorization header is needed
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        ToastAndroid.show(
          `${foodName} was  Added Successfully`,
          ToastAndroid.SHORT
        );
        setFoodName("");
        setPrice("");
        setDescription("");
        setOffer("");
        setTags("");
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

  const toggleTagSelection = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        padding: 20,
      }}
    >
      {/* Food Image Picker */}
      <TouchableOpacity
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          borderColor: "#df2020",
          marginBottom: 10,
        }}
        onPress={pickImage}
      >
        {foodImage ? (
          <Image
            source={{ uri: foodImage }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 60,
            }}
          />
        ) : (
          <ImagePlus size={50} color="#df2020" />
        )}
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 14,
          color: "#df2020",
          marginBottom: 20,
        }}
      >
        Food Image
      </Text>

      {/* Food Name Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          borderWidth: 1,
          borderColor: "#df2020",
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginVertical: 10,
        }}
      >
        <Utensils size={20} color="#df2020" />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 10,
            fontSize: 16,
            color: "#333",
          }}
          placeholder="Enter Food Name"
          value={foodName}
          onChangeText={setFoodName}
        />
      </View>

      {/* Price Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          borderWidth: 1,
          borderColor: "#df2020",
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginVertical: 10,
        }}
      >
        <BadgeIndianRupee size={20} color="#df2020" />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 10,
            fontSize: 16,
            color: "#333",
          }}
          placeholder="Enter Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
      </View>

      {/* Offer Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          borderWidth: 1,
          borderColor: "#df2020",
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginVertical: 10,
        }}
      >
        <Tag size={20} color="#df2020" />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 10,
            fontSize: 16,
            color: "#333",
          }}
          placeholder="Enter Offer (e.g., 10% Off)"
          keyboardType="numeric"
          value={offer}
          onChangeText={setOffer}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          borderWidth: 1,
          borderColor: "#df2020",
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginVertical: 10,
        }}
      >
        <FileText size={20} color="#df2020" />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 10,
            fontSize: 16,
            color: "#333",
          }}
          placeholder="Enter food Description (e.g.,momo with extra jhol)"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Multi-Select Tags */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 10,
      justifyContent:"flex-start"
        }}
      >
        Select Tags:
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          width: "100%",
          marginVertical: 10,
          display: "flex",
          flexDirection: "row",
          gap:20,
        }}
      >
        {predefinedTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
              padding: 10,
              backgroundColor: tags.includes(tag) ? "#df2020" : "#fff",
              borderColor: "#df2020",
              borderWidth: 1,
              borderRadius: 8,
              marginLeft:5
            }}
            onPress={() => toggleTagSelection(tag)}
          >
            <Hash size={20} color={tags.includes(tag) ? "#fff" : "#df2020"} />
            <Text
              style={{
                marginLeft: 10,
                color: tags.includes(tag) ? "#fff" : "#333",
                fontSize: 16,
              }}
            >
              {tag}
            </Text>
          
          </TouchableOpacity>
        ))}
      </ScrollView>
    
      {/* Submit Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#df2020",
          paddingVertical: 12,
          paddingHorizontal: 40,
          borderRadius: 8,
          marginTop: 20,
        }}
        onPress={handleAddFood}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Add Food
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Menu;
