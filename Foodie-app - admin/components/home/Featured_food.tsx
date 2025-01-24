import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, Text, ActivityIndicator } from "react-native";
import { FoodTitle } from "../global";
import { FoodCard } from "../global";
import ipAddress from '../global'
import { FoodCardProps } from "@/utils";

const FeaturedFood = () => {
  const [loading, setLoading] = useState(true);
  const [featuredFoods, setFeaturedFoods] = useState< FoodCardProps []>([]);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("http://192.168.1.67:9002/food");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const featured = data
        .sort((a: { price: number; }, b: { price: number; }) => b.price - a.price)
        .slice(0, 10); 

      setFeaturedFoods(featured);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch food items data.");
      console.error("Failed to fetch food items data:", error);
      setLoading(false);
    }
  };

  return (
    <View>
      <FoodTitle Topic="Featured" Title="Foods" />

      {loading ? (
        <ActivityIndicator size="large" color="#df2020" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: "row", marginTop: "5%" }}
        >
          {featuredFoods.length > 0 ? (
            featuredFoods.map((item, index) => (
              <FoodCard
                key={index}
                image={item.image }
                name={item.name}
                price={item.price}
                description={item.description}
                item={item}
                id={item.id}
                offer={item.offer}
                offerPer={item.offerPer}
                sides={item.sides}
                drinks={item.drinks}
                ingredients={item.ingredients}
                sidesprice={item.sidesprice}
                drinkprice={item.drinkprice}

              />
            ))
          ) : (
            <Text>No featured foods available</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default FeaturedFood;
