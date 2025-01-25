import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { router } from "expo-router";
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
import { useLocalSearchParams } from "expo-router";

interface FoodItem {
  food_id: string;
  food_name: string;
  price: string;
  offer: string;
  description: string;
  tags: string;
  image: string;
}

const UpdateFoods = () => {
  const params = useLocalSearchParams();
  const [foodDetails, setFoodDetails] = useState<FoodItem | null>({
    food_id: "",
    food_name: "",
    price: "",
    offer: "",
    description: "",
    tags: "",
    image: "",
  });
  const [loading, setIsLoading] = useState(false);
  console.log("params", params);
  useEffect(() => {
    if (params) {
      setFoodDetails({
        food_id: params.food_id as string,
        food_name: params.food_name as string,
        price: params.price as string,
        offer: params.offer as string,
        description: params.description as string,
        tags: params.tags as string,
        image: params.image as string,
      });
    }
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    
      quality: 1,
    });

    if (!result.canceled && foodDetails) {
      setFoodDetails({
        ...foodDetails,
        image: result.assets[0].uri,
      });
    }
  };

  const updateFood = async () => {
    setIsLoading(true);
    if (!foodDetails) {
      ToastAndroid.show("Food details are missing!", ToastAndroid.SHORT);
      return;
    }
    const formData = new FormData();

    // Add food details
    formData.append("foodname", foodDetails.food_name);
    formData.append("price", foodDetails.price);
    formData.append("offer", foodDetails.offer);
    formData.append("description", foodDetails.description);
    formData.append("tags", foodDetails.tags);
    // Add image only if a new image has been selected
    if (foodDetails.image.startsWith("file://")) {
      formData.append("image", {
        uri: foodDetails.image,
        name: `image_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);
    }

    try {
      const access_token = await getAccessToken();
      console.log("Access Token:", access_token);
      console.log("FormData content:", formData);

      const response = await fetch(
        `http://192.168.1.67:8000/fooddetails/${foodDetails.food_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: formData,
        }
      );

      console.log("Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error Response:", errorData);
        ToastAndroid.show(
          errorData.error || "Error occurred",
          ToastAndroid.SHORT
        );
        return;
      }

      ToastAndroid.show(
        `${foodDetails.food_name} was updated successfully`,
        ToastAndroid.SHORT
      );
      router.push("/home");
    } catch (error) {
      console.error("Network error:", error);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
    finally{
      setIsLoading(false)
    }
  };


  console.log("food image", foodDetails?.image);

  if (!foodDetails) {
    return <Text>Loading...</Text>;
  }

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
        {foodDetails.image ? (
          <Image
          source={{
            uri: foodDetails.image.startsWith('file:///')
              ? foodDetails.image
              : `http://192.168.1.67:8000${foodDetails.image}`
          }}
          
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
          value={foodDetails.food_name}
          onChangeText={(value) =>
            setFoodDetails({ ...foodDetails, food_name: value })
          }
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
          value={foodDetails.price}
          onChangeText={(value) =>
            setFoodDetails({ ...foodDetails, price: value })
          }
        />
      </View>

      {/* Other Inputs */}
      <View>
        {/* Offer */}
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
            placeholder="Enter Offer"
            value={foodDetails.offer}
            onChangeText={(value) =>
              setFoodDetails({ ...foodDetails, offer: value })
            }
          />
        </View>

        {/* Description */}
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
            placeholder="Enter Description"
            value={foodDetails.description}
            onChangeText={(value) =>
              setFoodDetails({ ...foodDetails, description: value })
            }
          />
        </View>

        {/* Tags */}
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
          <Hash size={20} color="#df2020" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 16,
              color: "#333",
            }}
            placeholder="Enter Tags"
            value={foodDetails.tags}
            onChangeText={(value) =>
              setFoodDetails({ ...foodDetails, tags: value })
            }
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#df2020",
          paddingVertical: 12,
          paddingHorizontal: 40,
          borderRadius: 8,
          marginTop: 20,
        }}
        onPress={updateFood}
        disabled={loading}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
          }}

        >
          {loading?"Updating...":"Update Food"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UpdateFoods;
