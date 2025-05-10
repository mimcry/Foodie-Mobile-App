import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAccessToken } from '@/utils/access_Token';
import { router } from 'expo-router';

const RestaurantSearchPage = () => {
   const fetchFoodItems = async () => {
     
      try {
        const access_token = await getAccessToken();
        const response = await fetch(
          "http://192.168.1.70:8000/fooddetails/menu",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setFoods(data);
          console.log("Menu Foods:", data);
        } else {
          throw new Error("Invalid data format: Expected an array");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch food items data.");
        console.error("Failed to fetch food items data:", error);
      } finally {
      
      }
    };
    useEffect(() => {
        fetchFoodItems();
      }, []);


  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState([]);

  const [filteredMenuItems, setFilteredMenuItems] = useState(foods);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMenuItems(foods);
    } else {
      const filtered = foods.filter((item) =>
        item.food_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMenuItems(filtered);
    }
  }, [searchQuery, foods]);
  const sortedMenuItems = foods.sort((a, b) => b.review - a.review);
  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={()=>{
      router.push({
        pathname:"/(food_description)/food_description",
        params:{item:JSON.stringify(item)}
      })
    }}>
     <Image
                   source={{ uri: `http://192.168.1.70:8000${item.image}` }}
                   style={styles.restaurantImage}
                 />
      <Text style={styles.menuItemName}>{item.food_name}</Text>
      <Text style={styles.menuItemPrice}>Rs{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#df2020" />
      
      {/* Restaurant Header */}
      <View style={styles.restaurantHeader}>
      
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>Greatest food delivery app in Nepal</Text>
          <Text style={styles.restaurantDescription}>Enjoy our delicious foods made with fresh ingredients!</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search menu items..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#777" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      
      <FlatList
        data={sortedMenuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
        
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop:20
  },
  restaurantHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#df2020',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  restaurantDescription: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#df2020',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuList: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#df2020',
  },
});

export default RestaurantSearchPage;
