import { useNavigation,router } from "expo-router";
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
  Alert,
} from "react-native";


// import { useNavigation } from "@react-navigation/native";
import Featured_Food from "@/components/home/Featured_food";
import Popular from "@/components/home/Popular";
import OfferCard from "@/components/home/OfferCard";
import { Tag } from "@/utils";
import { FoodItem } from "@/utils";
import Global from "@/components/global";
import LottieView from 'lottie-react-native';
import { getAccessToken } from "@/utils/access_Token";
const Homepage: React.FC = () => {
  const navigation = useNavigation<any>(); // Adjust navigation type based on your navigation setup
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState<FoodItem[]>([]);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: 'Pizza', image: require('@/image/pizzal.png') },
    { id: 2, name: 'Burger', image: require('@/image/Breakfast.png') },
    { id: 3, name: 'Fastfood', image: require('@/image/fastfood.png') },
    { id: 4, name: 'Coffee', image: require('@/image/coffee.png') },
    { id: 5, name: 'MoMo', image: require('@/image/momo.png') },
    { id: 6, name: 'Noodles', image: require('@/image/noodles.png') },
  ]);
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
      setFoodItems(data);
      
      
    } catch (error) {
      Alert.alert("Error", "Failed to fetch popular food items.");
      console.error("Failed to fetch popular food items:", error);
   
      
    }
  };
  useEffect(()=>{
    fetchPopularFood ()
  },[])

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
      offerPer: item.offer,
    });
  };

  const handleSearch = (text: string) => {
   
    setSearchQuery(text);
    if (text) {
      const filteredItems = foodItems.filter((item) =>
        item.food_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFoodItems(filteredItems);
      const suggestionItems = foodItems.filter((item) =>
        item.food_name.toLowerCase().includes(text.toLowerCase())
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
        <TouchableOpacity onPress={() => navigateToFood(item.name, item.id)}>
          <Image
            source={item.image}
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
        
        borderBottomWidth: 0.5,
        borderBottomColor: "gray",
        flexDirection: "row",
        backgroundColor: "white",
      }}
    >
      <Image
        source={{ uri: `http://192.168.1.67:8000${item.image}` }}
        style={{ width: 100, height: 100, borderRadius: 20 }}
      />
      {item.offer === 0  && (
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
          <Text style={{ color: "white" }}>{item.offer}% Off</Text>
        </View>
      )}
      <View style={{ alignSelf: "center", marginLeft: 20, width: 230 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.food_name}</Text>
        <Text style={{ fontSize: 14 }}>{item.description}</Text>

        {item.offer === 0 ? (
          <View style={{ flexDirection: "row" }}>
            <Text style={{ textDecorationLine: "line-through" }}>
              {" "}
              Rs.{item.price}
            </Text>
            <Text style={{ color: "green", marginLeft: 5 }}>
              Rs.{item.price - (item.price * item.offer) / 100}
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
      onPress={() => handleSearch(item.food_name)}
    >
      <Image
        source={{ uri: `http://192.168.1.67:8000${item.image}` }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
      />
      <Text>{item.food_name}</Text>
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
         
          {filteredFoodItems.length > 0 ? (
            <FlatList
              data={filteredFoodItems}
              keyExtractor={(item) => item.food_name}
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
