import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TextInput,
  Animated,
  Alert,
} from "react-native";
import { Search } from "lucide-react";
import { Ionicons } from "@expo/vector-icons";
import { getAccessToken } from "@/utils/access_Token";
import { FoodItem } from "@/utils";
import Index from "..";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
const { width } = Dimensions.get("window");

const Menu = () => {
  const [Foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredData, setFilteredData] = useState(Foods);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const fetchFoodItems = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  // Handle tag parameter from home page navigation
  useEffect(() => {
    if (params.params && Foods.length > 0) {
      console.log("Applying tag filter from home page:", params.params);
      setSelectedTag(params.params.toString());
      // The filterData effect will handle the actual filtering
    }
  }, [params.params, Foods.length]);

  // Fetch data on component mount
  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Initialize filteredData with all Foods once loaded
  useEffect(() => {
    if (Foods.length > 0) {
      // Only initialize if no filters are active
      if (!selectedTag && selectedPrice === null && searchQuery === "") {
        setFilteredData(Foods);
      } else {
        // Otherwise, apply existing filters to the new data
        filterData();
      }
    }
  }, [Foods]);

  const filterData = () => {
    if (Foods.length === 0) return;

    let updatedData = [...Foods];

    if (selectedTag) {
      updatedData = updatedData.filter((item) => item.tags === selectedTag);
    }
    if (selectedTag == "All") {
      updatedData = [...Foods];
    }

    if (selectedPrice !== null) {
      updatedData = updatedData.filter((item) => item.price <= selectedPrice);
    }

    if (searchQuery.trim() !== "") {
      updatedData = updatedData.filter((item) =>
        item.food_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(updatedData);
  };

  // Apply filters whenever a filter criteria changes
  useEffect(() => {
    filterData();
  }, [selectedTag, selectedPrice, searchQuery]);

  // Filter functions that update state
  const filterByTag = (tags) => {
    setSelectedTag(tags);
    // filterData will be triggered by the useEffect
  };

  const filterByPrice = (priceLimit) => {
    setSelectedPrice(priceLimit);
    // filterData will be triggered by the useEffect
  };

  const dispatch = useDispatch();
  const handleAddToCart = (item: any) => {
    dispatch(
      addToCart({
        id: item.food_id,
        name: item.food_name,
        price: item.price,
        image: item.image,
        description: item.description,
        quantity: 1,
      })
    );
  };

  const categories = ["All", "Pizza", "Burger", "Vegan", "Dessert", "Drinks"];
  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View
          style={{
            position: "absolute",
            alignItems: "center",
            left: 25,
            zIndex: 10,
            justifyContent: "space-between",
            flexDirection: "row",
            gap: 240,
          }}
        >
          <Ionicons name="search-outline" size={20} color="red" />
          {searchQuery && (
            <TouchableOpacity
              style={{ marginLeft: "auto" }}
              onPress={() => setSearchQuery("")}
            >
              <Ionicons name="close-circle-outline" size={22} color="red" />
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          placeholder="Search for food, restaurants..."
          style={styles.searchBar}
          value={searchQuery}
          onChangeText={setSearchQuery}
        ></TextInput>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSelectedFilter(!selectedFilter)}
        >
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {selectedFilter && (
        <>
          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScrollView}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryButton,
                    selectedTag === (category === "All" ? "" : category)
                      ? styles.categoryButtonActive
                      : null,
                  ]}
                  onPress={() =>
                    filterByTag(category === "All" ? "" : category)
                  }
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedTag === (category === "All" ? "" : category)
                        ? styles.categoryButtonTextActive
                        : null,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Price Filter Chips */}
          <View style={styles.priceFilterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.priceFilterScrollView}
            >
              <TouchableOpacity
                style={[
                  styles.priceChip,
                  selectedPrice === null ? styles.priceChipActive : null,
                ]}
                onPress={() => filterByPrice(null)}
              >
                <Text
                  style={[
                    styles.priceChipText,
                    selectedPrice === null ? styles.priceChipTextActive : null,
                  ]}
                >
                  All Prices
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priceChip,
                  selectedPrice === 300 ? styles.priceChipActive : null,
                ]}
                onPress={() => filterByPrice(300)}
              >
                <Text
                  style={[
                    styles.priceChipText,
                    selectedPrice === 300 ? styles.priceChipTextActive : null,
                  ]}
                >
                  Under Rs300
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priceChip,
                  selectedPrice === 500 ? styles.priceChipActive : null,
                ]}
                onPress={() => filterByPrice(500)}
              >
                <Text
                  style={[
                    styles.priceChipText,
                    selectedPrice === 500 ? styles.priceChipTextActive : null,
                  ]}
                >
                  Under Rs500
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priceChip,
                  selectedPrice === 700 ? styles.priceChipActive : null,
                ]}
                onPress={() => filterByPrice(700)}
              >
                <Text
                  style={[
                    styles.priceChipText,
                    selectedPrice === 700 ? styles.priceChipTextActive : null,
                  ]}
                >
                  Under Rs700
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </>
      )}

      {/* Main Menu */}
      <Text style={styles.sectionTitle}>
        {selectedTag || selectedPrice ? `${selectedTag}` : "All Items"} (
        {filteredData.length})
      </Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.food_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: "/(food_description)/food_description",
                params: {
                  item: JSON.stringify(item),
                },
              });
            }}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: `http://192.168.1.70:8000${item.image}` }}
                style={styles.image}
              />
              {item.offer > 0 && (
                <View style={styles.offerBadge}>
                  <Text style={styles.offerText}>{item.offer}% OFF</Text>
                </View>
              )}
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.food_name}
                </Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.averageRating}</Text>
                </View>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.bottomRow}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Rs</Text>
                  <Text style={styles.price}>{item.price}</Text>
                </View>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#df2020",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  cartContainer: {
    position: "relative",
  },
  cartButton: {
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#df2020",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    position: "relative",
    zIndex: 5,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 35,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    color: "#999",
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: "#df2020",
    width: 42,
    height: 42,
    borderRadius: 12,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesScrollView: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: "#df2020",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  categoryButtonTextActive: {
    color: "#fff",
  },
  priceFilterContainer: {
    marginBottom: 16,
  },
  priceFilterScrollView: {
    paddingHorizontal: 16,
  },
  priceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  priceChipActive: {
    backgroundColor: "#FFF0ED",
    borderColor: "#df2020",
  },
  priceChipText: {
    fontSize: 13,
    color: "#666",
  },
  priceChipTextActive: {
    color: "#df2020",
    fontWeight: "600",
  },
  featuredSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    paddingHorizontal: 16,
    color: "#333",
  },
  featuredScrollView: {
    paddingLeft: 16,
  },
  featuredCard: {
    width: width * 0.6,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  featuredOfferBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#df2020",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  featuredOfferText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  featuredInfo: {
    padding: 12,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  featuredMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#df2020",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    height: 160,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  offerBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FF3B30",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  offerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  contentContainer: {
    padding: 16,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginLeft: 2,
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginRight: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },

  tagText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default Menu;
