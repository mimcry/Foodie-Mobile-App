import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import FoodCard from "@/components/FoodCard";
import { getAccessToken } from "@/utils/access_Token";
import { router } from "expo-router";
interface FoodItem {
  food_id: string ;
  food_name: string;
  price: string;
  offer: string;
  description: string;
  tags: string;
  image: string;
}
const past_order = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const fetchFoodItems = async () => {
    try {
      const access_token = await getAccessToken();
      const response = await fetch("http://192.168.1.67:8000/fooddetails/menu",{  method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      console.error("Error fetching food:", error);
    
    } 
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

console.log("Food Items :",foodItems)
  const handleEdit = (food:FoodItem) => {
    console.log("Edit food:", food);
    router.push({
      pathname: "/helper/UpdateFoods",
      params: {
        food_id: food.food_id,
        food_name: food.food_name,
        price: food.price,
        offer: food.offer,
        description: food.description,
        tags: food.tags,
        image: food.image
      }
    });
  };

  const handleDelete = (id:string) => {
    setFoodItems((prevItems) => prevItems.filter((item) => item.food_id!== id));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={foodItems}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.food_id.toString()}
        renderItem={({ item }) => (
          <FoodCard food={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
});

export default past_order;
