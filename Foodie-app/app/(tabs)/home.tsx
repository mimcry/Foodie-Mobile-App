import { useNavigation } from "expo-router";
import Icon from "@/constants/icons";
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";


// import { useNavigation } from "@react-navigation/native";
import Featured_Food from "@/components/home/Featured_food";
import Popular from "@/components/home/Popular";
import OfferCard from "@/components/home/OfferCard";
import { Tag } from "@/utils";
import { FoodItem } from "@/utils";
import Global from "@/components/global";
import LottieView from 'lottie-react-native';
const Homepage: React.FC = () => {
  const navigation = useNavigation<any>(); // Adjust navigation type based on your navigation setup
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState<FoodItem[]>([]);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchFoodData();
    fetchTagData();
  }, []);

  const fetchFoodData = () => {
    fetch("http://192.168.1.67:9002/food")
      .then((response) => response.json())
      .then((data) => {
        setFoodItems(data);
        setFilteredFoodItems(data);
      })
      .catch((error) => console.error("Error fetching food data:", error));
  };
  console.log("fooditems", foodItems);
  console.log("filterdfood", filteredFoodItems);
  console.log("tags", tags);
  const fetchTagData = () => {
    fetch("http://192.168.1.67:9002/tags")
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) => console.error("Error fetching tags:", error));
  };

  const navigateToFood = (name: string, _id: string) => {
    navigation.navigate("foodscreen", {
      selectedId: _id,
      selectedTagName: name,
    });
  };

  const onPressItem = (item: FoodItem) => {
    navigation.navigate("fooddescription", {
      item,
      offer: item.offer,
      offerPer: item.offerPer,
    });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filteredItems = foodItems.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFoodItems(filteredItems);

      const suggestionItems = foodItems.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(suggestionItems);
    } else {
      setFilteredFoodItems(foodItems);
      setSuggestions([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredFoodItems(foodItems);
    setSuggestions([]);
  };

  const renderTagSelection = () => (
    <FlatList
      data={tags}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigateToFood(item.name, item._id)}>
          <Image
            source={{ uri: item.image }}
            style={{ objectFit: "contain", width: 60, height: 60 }}
          />
          <Text style={{ alignSelf: "center" }}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Text>
        </TouchableOpacity>
      )}
      style={{ marginBottom: 10 }}
    />
  );

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <View
      style={{
        padding: 20,
        paddingBottom:10,
        
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        flexDirection: "row",
        backgroundColor: "white",
      }}
    >
      <Image
        source={{ uri: `${item.image}` }}
        style={{ width: 100, height: 100, borderRadius: 20 }}
      />
      {item.offer && (
        <View
          style={{
            position: "absolute",
            borderTopLeftRadius: 25,
            backgroundColor: "red",
            paddingVertical: 2,
            paddingHorizontal: 5,
            borderRadius: 5,
            marginTop: 20,
            marginLeft: 20,
          }}
        >
          <Text style={{ color: "white" }}>{item.offerPer}% Off</Text>
        </View>
      )}
      <View style={{ alignSelf: "center", marginLeft: 20, width: 230 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ fontSize: 14 }}>{item.description}</Text>

        {item.offerPer ? (
          <View style={{ flexDirection: "row" }}>
            <Text style={{ textDecorationLine: "line-through" }}>
              {" "}
              Rs.{item.price}
            </Text>
            <Text style={{ color: "green", marginLeft: 5 }}>
              Rs.{item.price - (item.price * item.offerPer) / 100}
            </Text>
          </View>
        ) : (
          <Text style={{ color: "green" }}>Rs. {item.price}</Text>
        )}
       
      </View>
    </View>
  );
  const renderSuggestionItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={{ padding: 10, flexDirection: "row", alignItems: "center" }}
      onPress={() => handleSearch(item.name)}
    >
      <Image
        source={{ uri: `${item.image}` }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
      />
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white", marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 25,
            backgroundColor: "#f7e3e1",
            paddingLeft: 50,
            paddingRight: 10,
            height: 50,
            marginLeft: 0,marginBottom:10
          }}
        >
        
          <TextInput
            style={{ color: "black", marginTop: 5, width: 290, }}
            placeholder="Search for your meal"
            placeholderTextColor="black"
            onChangeText={handleSearch}
            value={searchQuery}
          />  <Icon
          name="Search"
          size={20}
          style={{
            position: "relative",

            top: -30,left:-30,
            zIndex: 1,
          }}
          color="#df2020"
        />
          {searchQuery.length > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={clearSearch}>
              <Icon
                name="X"
                size={20}
                style={{
                  position: "absolute",
                  right: 10,
                  top: -50,
                }}
                color="#df2020"
              />
            </TouchableOpacity>
          )}
          {/* <Icon
            name="search1"
            size={20}
            style={{
              position: "absolute",
              left: 20,
              top: 15,
              
            }}
          /> */}
        </View>
      </View>
      {searchQuery ? (
        <>
          {/* {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSuggestionItem}
              style={{
                backgroundColor: "#f7e3e1",
                marginTop: 0,
                borderRightWidth:0,marginHorizontal:20
              }}
            />
          )} */}
          {filteredFoodItems.length > 0 ? (
            <FlatList
              data={filteredFoodItems}
              keyExtractor={(item) => item.name}
              renderItem={renderFoodItem}
              style={{ marginTop: "1%" }}
            />
          ) : (
            <View style={{ marginTop: 400, alignItems: "center",justifyContent:"center"}}>
                  <LottieView
                source={require('@/assets/icons/no-search.json')} 
                autoPlay
                loop={true}
                style={{ height:400, width: '100%', position: 'absolute', bottom: 0}}
              />
              <Text style={{ fontSize: 18, color: "#df2020" }}>
                Sorry, No food found.
              </Text>
            </View>
          )}
        </>
      ) : (
        <FlatList
          data={[]}
          ListHeaderComponent={
            <>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 26,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#df2020",
                }}
              >
                GETTING HUNGRY?
              </Text>
              <Text
                style={{
                  fontSize: 25,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                FOODIE{" "}
                <Text
                  style={{ fontSize: 30, color: "#df2020", fontWeight: "bold" }}
                >
                  delivers at
                </Text>
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  {" "}
                  your door
                </Text>
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  marginHorizontal: 15,
                }}
              >
                {renderTagSelection()}
              </View>
              <View style={{ marginHorizontal: 20 }}>
                <Featured_Food />
                <Popular />
                <OfferCard />
              </View>
            </>
          }
          renderItem={null}
        />
      )}
    </View>
  );
};

export default Homepage;
