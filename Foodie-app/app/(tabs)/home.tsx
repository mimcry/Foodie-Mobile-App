import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Popular from "@/components/home/Popular";
import { getAccessToken } from "@/utils/access_Token";
import { FoodCardProps } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userId } from "@/utils/id";
import handelTokenExpiry from "@/utils/handelRefresh";
const HomeScreen = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [featuredFoods, setFeaturedFoods] = useState<FoodCardProps[]>([]);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>({
    name: "",
    email: "",
    phone_number: "",
    avatar: "",
    address: "",
  });
  const fetchUserDetails = async () => {
    const access_token = await getAccessToken();
    const id = await userId();
    if (!access_token) {
      setError("No token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.66:8000/profile/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (response.status === 401) {
        console.log("Token expired or invalid.");
        handelTokenExpiry();
      }

      const data = await response.json();
      setUserDetails(data);

      await AsyncStorage.setItem("user image", userDetails?.avatar ?? "");
      await AsyncStorage.setItem("user name", userDetails?.name ?? "");
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to load user profile");
    }
  };
  console.log("user details", { userDetails });
  useEffect(() => {
    fetchFoodItems();
    fetchUserDetails();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const access_token = await getAccessToken();
      const response = await fetch(
        "http://192.168.1.66:8000/fooddetails/menu",
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

      const featured = data
        .sort((a: { price: number }, b: { price: number }) => b.price - a.price)
        .slice(0, 10);

      setFeaturedFoods(featured);
      console.log("Featured Foods:", featured);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch food items data.");
      console.error("Failed to fetch food items data:", error);
      setLoading(false);
    }
  };

  // Mock data for categories
  const categories = [
    { id: "1", name: "All", icon: "restaurant" },
    { id: "2", name: "Pizza", icon: "pizza" },
  
    { id: "3", name: "Burger", icon: "fast-food" },
    { id: "4", name: "Dessert", icon: "ice-cream" },
    { id: "5", name: "Drinks", icon: "cafe" },
    { id: "6", name: "Vegan", icon: "leaf" },
  ];

  // Mock data for popular items
  const popularItems = [
    {
      id: "1",
      food_name: "Margherita Pizza",
      price: 299,
      averageRating: 4.7,
      offer: 15,
      image: "/images/pizza.jpg",
      description: "Classic cheese pizza with fresh basil",
    },
    {
      id: "2",
      food_name: "Double Cheese Burger",
      price: 199,
      averageRating: 4.5,
      offer: 0,
      image: "/images/burger.jpg",
      description: "Juicy beef patty with extra cheese",
    },
    {
      id: "3",
      food_name: "Chicken Biryani",
      price: 249,
      averageRating: 4.8,
      offer: 10,
      image: "/images/biryani.jpg",
      description: "Aromatic rice with tender chicken pieces",
    },
  ];

  // Mock data for featured restaurants
  const restaurants = [
    {
      id: "1",
      name: "Pizza Paradise",
      rating: 4.6,
      deliveryTime: "25-30 min",
      image: "/images/restaurant1.jpg",
    },
    {
      id: "2",
      name: "Burger Bros",
      rating: 4.4,
      deliveryTime: "15-20 min",
      image: "/images/restaurant2.jpg",
    },
    {
      id: "3",
      name: "Spice Garden",
      rating: 4.7,
      deliveryTime: "30-35 min",
      image: "/images/restaurant3.jpg",
    },
  ];

  const handleAddToCart = (item) => {
    // Implement your add to cart functionality here
    console.log("Added to cart:", item.food_name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>
            Hi, {userDetails?.name?.split(" ")[0]}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#df2020" />
            <Text style={styles.locationText}>
              {userDetails.address}, Nepal
            </Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/profile")}
          >
            <Image
              source={{ uri: `http://192.168.1.66:8000${userDetails.avatar}` }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} >
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for food, restaurants..."
            style={styles.searchInput}
            placeholderTextColor="#999"
            onPress={()=> router.push("/(searchpage)/search_page")}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Promo Banner */}
        <TouchableOpacity style={styles.promoBanner}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/1200px-Pizza-3007395.jpg",
            }}
            style={styles.promoBannerImage}
          />
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>50% OFF</Text>
            <Text style={styles.promoSubtitle}>On your first order</Text>
            <View style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Order Now</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/(tabs)/menu",
              });
            }}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                activeCategory === category.name && styles.activeCategoryItem,
              ]}
              onPress={() => {
                setActiveCategory(category.name);
                const params = category.name;
                router.push({
                  pathname: "/(tabs)/menu",
                  params: { params },
                });
              }}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons
                  name={category.icon}
                  size={22}
                  color={activeCategory === category.name ? "#fff" : "#df2020"}
                />
              </View>
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.name && styles.activeCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Popular />

        {/* Featured Restaurants */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured food</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {featuredFoods.map((food) => (
          <TouchableOpacity
            key={food.food_id}
            style={styles.restaurantCard}
            onPress={() =>
              router.push({
                pathname: "/(food_description)/food_description",
                params: {
                  item: JSON.stringify(food),
                },
              })
            }
          >
            <Image
              source={{ uri: `http://192.168.1.66:8000${food.image}` }}
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{food.food_name}</Text>
              <View style={styles.restaurantMetaContainer}>
                <View style={styles.restaurantMeta}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.restaurantMetaText}>
                    {food.averageRating}
                  </Text>
                </View>
                <View style={styles.restaurantMeta}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.restaurantMetaText}>
                    {food.duration} Min
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        ))}

        {/* Spacing at bottom */}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greetingText: {
    fontSize: 14,
    color: "#666",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    position: "relative",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#df2020",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  filterButton: {
    backgroundColor: "#df2020",
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  promoBanner: {
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    position: "relative",
  },
  promoBannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  promoTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  promoTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
    opacity: 0.9,
  },
  promoButton: {
    backgroundColor: "#df2020",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  promoButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#df2020",
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    width: 70,
  },
  activeCategoryItem: {
    opacity: 1,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f7bcbc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 69, 0, 0.1)",
  },
  categoryText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#df2020",
    fontWeight: "600",
  },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  restaurantImage: {
    width: 90,
    height: 90,
    resizeMode: "cover",
  },
  restaurantInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  restaurantMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  restaurantMetaText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  arrowContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  orderButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#df2020",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -24,
    shadowColor: "#df2020",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  navText: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});

export default HomeScreen;
