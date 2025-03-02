import React, { useEffect, useState } from "react";
import { 
  FlatList, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Image,
  TextInput,
  ToastAndroid,
  Alert
} from "react-native";
import { getAccessToken } from "@/utils/access_Token";
import { router } from "expo-router";
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingBag, 
  Edit2, 
  Trash2,
  AlertCircle
} from "lucide-react-native";

interface FoodItem {
  food_id: string;
  food_name: string;
  price: string;
  offer: string;
  description: string;
  tags: string;
  image: string;
  calories?: string;
  duration?: string;
}

// Custom FoodCard component embedded directly in this file
const FoodCard = ({ food, onEdit, onDelete }) => {
  const tags = food.tags ? food.tags.split(',').map(tag => tag.trim()) : [];
  
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardImageContainer}>
        <Image 
          source={{ uri: `http://192.168.1.66:8000${food.image}`}} 
          style={styles.cardImage} 
          resizeMode="cover"
        />
        {food.offer && parseInt(food.offer) > 0 && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerText}>{food.offer}% OFF</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.foodName}>{food.food_name}</Text>
            <Text style={styles.foodDescription} numberOfLines={2}>
              {food.description}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceSymbol}>Rs</Text>
            <Text style={styles.priceValue}>{food.price}</Text>
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        
        {(food.calories || food.duration) && (
          <View style={styles.foodMetaContainer}>
            {food.calories && (
              <Text style={styles.foodMeta}>{food.calories} cal</Text>
            )}
            {food.duration && (
              <Text style={styles.foodMeta}>{food.duration} min</Text>
            )}
          </View>
        )}
        
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={() => onEdit(food)}
          >
            <Edit2 size={16} color="#007bff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={() => onDelete(food.food_id)}
          >
            <Trash2 size={16} color="#dc3545" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const MenuList = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const deleteFood = async () => {
    
    Alert.alert(
      "Delete Food Item",
      `Are you sure you want to delete "${foodItems.food_name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const access_token = await getAccessToken();
              const response = await fetch(
                `http://192.168.1.66:8000/fooddetails/${foodItems.food_id}/delete`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                  },
                  body: JSON.stringify({ food_id: foodItems.food_id }),
                }
              );
              if (response.ok) {
                const result = await response.json();
                console.log("Delete Response:", result.message);
                ToastAndroid.show(
                  `${foodItems.food_name} deleted successfully: ${result.message}`,
                  ToastAndroid.SHORT
                );
               
              } else {
                console.error("Delete failed:", response.statusText);
                ToastAndroid.show(
                  `Delete failed: ${response.statusText}`,
                  ToastAndroid.SHORT
                );
              }
            } catch (error) {
              console.error("Network error:", error);
              ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const fetchFoodItems = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError("");
    
    try {
      const access_token = await getAccessToken();
      const response = await fetch(
        "http://192.168.1.66:8000/fooddetails/menu",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      
      const data = await response.json();
      setFoodItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Error fetching food:", error);
      setError("Unable to load menu items. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(foodItems);
    } else {
      const filtered = foodItems.filter(
        item => 
          item.food_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, foodItems]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchFoodItems(false);
  };

  const handleEdit = (food: FoodItem) => {
    router.push({
      pathname: "/helper/UpdateFoods",
      params: {
        food_id: food.food_id,
        food_name: food.food_name,
        price: food.price,
        offer: food.offer,
        description: food.description,
        tags: food.tags,
        image: food.image,
        calories: food.calories || "",
        duration: food.duration || ""
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const access_token = await getAccessToken();
      const response = await fetch(
        `http://192.168.1.66:8000/fooddetails/food/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.ok) {
        setFoodItems((prevItems) => prevItems.filter((item) => item.food_id !== id));
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };

  const handleAddNew = () => {
    router.push("/(addfood)/addfood");
  };

  return (
    <View style={styles.container}>
  <View style={styles.header}>
         
         <TouchableOpacity 
           style={styles.addButton}
           onPress={handleAddNew}
         >
           <Plus size={20} color="#fff" style={{marginLeft:110}} />
           <Text style={styles.addButtonText}>Add New</Text>
         </TouchableOpacity>
       </View>
    
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or tag..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={24} color="#dc3545" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchFoodItems()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#df2020" />
          <Text style={styles.loadingText}>Loading menu items...</Text>
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={50} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery ? "No matching food items found" : "Your menu is empty"}
          </Text>
          {searchQuery ? (
            <TouchableOpacity 
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery("")}
            >
              <Text style={styles.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.addFirstItemButton}
              onPress={handleAddNew}
            >
              <Text style={styles.addFirstItemText}>Add Your First Item</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.food_id.toString()}
          renderItem={({ item }) => (
            <FoodCard food={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={handleRefresh}
              colors={["#df2020"]}
              tintColor="#df2020"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#df2020",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    width:"100%"
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
    textAlign:"center"
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#777",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  addFirstItemButton: {
    backgroundColor: "#df2020",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstItemText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  clearSearchButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#df2020",
  },
  clearSearchText: {
    color: "#df2020",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#777",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#df2020",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Food Card Styles
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  offerBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#df2020",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  offerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    maxWidth: "75%",
  },
  foodDescription: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
    maxWidth: "90%",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  priceSymbol: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#df2020",
    marginTop: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#df2020",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  tagChip: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#555",
  },
  foodMetaContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  foodMeta: {
    fontSize: 14,
    color: "#777",
    marginRight: 16,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: "rgba(0, 123, 255, 0.1)",
  },
  deleteButton: {
    backgroundColor: "rgba(220, 53, 69, 0.1)",
  },
  editButtonText: {
    color: "#007bff",
    fontWeight: "bold",
    marginLeft: 4,
  },
  deleteButtonText: {
    color: "#dc3545",
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default MenuList;