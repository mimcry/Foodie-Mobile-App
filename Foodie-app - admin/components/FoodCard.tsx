import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";

interface FoodCardProps {
    food: {
        food_id: string;
      food_name: string;
      price: string;
      offer: string;
      description: string;
      tags: string;
      image: string;
    };
    onEdit: (food: any) => void;
    onDelete: (id: string) => void;
  }

const FoodCard: React.FC<FoodCardProps> = ({ food, onEdit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      "Delete Food",
      `Are you sure you want to delete ${food.food_name}?`,
     
    );
  };

  return (
    <View style={styles.card}>
      {/* Food Image */}
      <Image
        source={{ uri: `http://192.168.1.67:8000${food.image}`|| "https://via.placeholder.com/150" }}
        style={styles.image}
      />

      {/* Food Details */}
      <View style={styles.details}>
        <Text style={styles.foodName}>{food.food_name}</Text>
        <Text style={styles.description}>{food.description}</Text>
        <Text style={styles.price}>Price: ₹{food.price}</Text>
        <Text style={styles.offer}>Offer: {food.offer}</Text>
        <Text style={styles.tags}>Tags: {food.tags}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(food)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  details: {
    padding: 16,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#df2020",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  offer: {
    fontSize: 14,
    color: "#df2020",
    marginBottom: 8,
  },
  tags: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  editButton: {
    backgroundColor: "#ffc107",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#df2020",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default FoodCard;
