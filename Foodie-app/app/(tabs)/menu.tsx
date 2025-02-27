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

      setFoods(data);
      console.log("Featured Foods:", data);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch food items data.");
      console.error("Failed to fetch food items data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFoodItems();
  }, []);

  const filterData = () => {
    let updatedData = Foods;

    if (selectedTag) {
      updatedData = updatedData.filter((item) => item.tags === selectedTag);
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

  useEffect(() => {
    filterData();
  }, [selectedTag, selectedPrice, searchQuery, Foods]);

  const filterByTag = (tags) => {
    setSelectedTag(tags);
    if (!tags) {
      // If no tag is selected (All), reset to the current price filter if any
      setFilteredData(
        selectedPrice
          ? Foods.filter((item) => item.price <= selectedPrice)
          : Foods
      );
    } else {
      // Apply both tag and price filter if price filter is active
      setFilteredData(
        Foods.filter((item) => {
          const matchesTag = item.tags === tags;

          const matchesPrice = selectedPrice
            ? item.price <= selectedPrice
            : true;
          return matchesTag && matchesPrice;
        })
      );
    }
  };
  useEffect(() => {
    setFilteredData(Foods);
  }, [Foods]);
  const filterByPrice = (priceLimit) => {
    setSelectedPrice(priceLimit);
    if (!priceLimit) {
      // If no price limit (All Prices), reset to the current tag filter if any
      setFilteredData(
        selectedTag ? Foods.filter((item) => item.tags === selectedTag) : Foods
      );
    } else {
      // Apply both tag and price filter if tag filter is active
      setFilteredData(
        Foods.filter((item) => {
          const matchesPrice = item.price <= priceLimit;
          const matchesTag = selectedTag ? item.tags === selectedTag : true;
          return matchesPrice && matchesTag;
        })
      );
    }
  };

  const addToCart = () => {
    setCartCount((prevCount) => prevCount + 1);
  };

  const categories = [
    "All",
    "Pizza",
    "Burger",
    "Breakfast",
    "Desserts",
    "Drinks",
  ];
  const { width } = Dimensions.get("window");
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerWidth = scrollY.interpolate({
    inputRange: [0, 150], // Scroll range
    outputRange: [width, 100], // Full width to a small fixed width
    extrapolate: "clamp",
  });
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
          {searchQuery &&<TouchableOpacity style={{ marginLeft: "auto" }} onPress={()=>setSearchQuery("")}>
            <Ionicons name="close-circle-outline" size={22} color="red" />
          </TouchableOpacity>}
          
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
        {selectedTag || selectedPrice ? "Filtered Results" : "All Items"} (
        {filteredData.length})
      </Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.food_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: `http://192.168.1.66:8000${item.image}` }}
              style={styles.image}
            />
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>{item.offer}% off</Text>
            </View>
            <View style={styles.textContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.food_name}{" "}
                </Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>4.2</Text>
                </View>
              </View>
              {/* <Text style={styles.tagText}>{item.tags}</Text> */}
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.description}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.price}>Rs{item.price}</Text>
                <TouchableOpacity style={styles.addButton} onPress={addToCart}>
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  offerBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#df2020",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  offerText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555",
    marginLeft: 2,
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
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#df2020",
  },
  addButton: {
    backgroundColor: "#df2020",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
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
