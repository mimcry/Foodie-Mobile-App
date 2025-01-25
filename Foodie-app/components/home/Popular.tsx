import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import { FoodCard, FoodTitle } from "../global";
import ipAddress from "../global";
import { FoodItem } from "@/utils";
import { getAccessToken } from "@/utils/access_Token";
const Popular = () => {
  const [loading, setLoading] = useState(true);
  const [popularFoods, setPopularFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    fetchPopularFood();
  }, []);

  const fetchPopularFood = async () => {
    try {
      const access_token = await getAccessToken();
      const response = await fetch(
        `http://192.168.1.67:8000/fooddetails/menu`,
        {
          method: "GET",
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPopularFoods(data);
      setLoading(false);
      console.log("Popular foods count:", popularFoods);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch popular food items.");
      console.error("Failed to fetch popular food items:", error);
      setLoading(false);
    }
  };

  return (
    <View>
      <FoodTitle Topic="Popular" Title="Foods" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexDirection: "row", marginTop: "5%" }}
      >
        {popularFoods.map((item, index) => (
          <FoodCard
            key={index}
            image={item.image}
            food_name={item.food_name}
            price={item.price}
            item={item}
            description={item.description}
            food_id={item.food_id}
            offer={item.offer}
            tags={item.tags}
            sides={item.sides}
            drinks={item.drinks}
            ingredients={item.ingredients}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Popular;
