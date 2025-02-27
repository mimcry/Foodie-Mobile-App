import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Button } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import { Checkbox, Provider as PaperProvider } from "react-native-paper";
import { useNavigation, useRoute, } from "@react-navigation/native";
import { useCart } from "react-use-cart";
import { useLocalSearchParams } from "expo-router";
import { GlobalButton } from "@/components/global";

const Food_description = () => {
  const theme = {
    colors: {
      primary: "#df2020",
    },
  };
  const route = useRoute();
  const params = useLocalSearchParams();
console.log("params ",params )
const item = params.item ? JSON.parse(params.item) : null;
  // const initialSelectedSides = item.sides.reduce((acc, side) => {
  //   acc[side.name] = false;
  //   return acc;
  // }, {});

  // const initialSelectedDrinks = item.drinks.reduce((acc, drink) => {
  //   acc[drink.name] = false;
  //   return acc;
  // }, {});

  // const [selectedSides, setSelectedSides] = useState(initialSelectedSides);
  // const [selectedDrinks, setSelectedDrinks] = useState(initialSelectedDrinks);

  // const handleCheckboxChange = (sideName) => {
  //   setSelectedSides((prevState) => {
  //     const updatedSelectedSides = {
  //       ...prevState,
  //       [sideName]: !prevState[sideName],
  //     };
  //     return updatedSelectedSides;
  //   });
  // };

  // const handleCheckboxChangeDrink = (drinkName) => {
  //   setSelectedDrinks((prevState) => {
  //     const updatedSelectedDrinks = {
  //       ...prevState,
  //       [drinkName]: !prevState[drinkName],
  //     };
  //     return updatedSelectedDrinks;
  //   });
  // };

  // const renderSelectedSides = () => {
  //   const selected = Object.keys(selectedSides).filter(
  //     (side) => selectedSides[side]
  //   );
  //   return selected.length > 0
  //     ? `Selected sides: ${selected.join(", ")}`
  //     : null;
  // };

  // const renderSelectedDrinks = () => {
  //   const selected = Object.keys(selectedDrinks).filter(
  //     (drink) => selectedDrinks[drink]
  //   );
  //   return selected.length > 0
  //     ? `Selected drinks: ${selected.join(", ")}`
  //     : null;
  // };

  // const navigation = useNavigation();
  // const { addItem } = useCart();
  // const [quantity, setQuantity] = useState(1);
  // const [alertVisible, setAlertVisible] = useState(false);

  // const increaseQuantity = () => {
  //   setQuantity((prevQuantity) => prevQuantity + 1);
  // };

  // const decreaseQuantity = () => {
  //   if (quantity > 1) {
  //     setQuantity((prevQuantity) => prevQuantity - 1);
  //   }
  // };
  // const hasGarlic = item.ingredients.includes("Garlic");
  // const addItemToCart = () => {
  //   if (hasGarlic) {
  //     setAlertVisible(true);
  //   } else {
  //     addItemToCartConfirmed();
  //   }
  // };

  // const addItemToCartConfirmed = () => {
  //   const selectedDrinksArray = Object.keys(selectedDrinks).filter(
  //     (drink) => selectedDrinks[drink]
  //   );
  //   const selectedSidesArray = Object.keys(selectedSides).filter(
  //     (side) => selectedSides[side]
  //   );

  //   const selectedSidesPrices = selectedSidesArray.map(
  //     (side) => item.sides.find((s) => s.name === side).price
  //   );

  //   const selectedDrinksPrices = selectedDrinksArray.map(
  //     (drink) => item.drinks.find((d) => d.name === drink).price
  //   );

  //   console.log("Selected sides prices:", selectedSidesPrices);
  //   console.log("Selected drinks prices:", selectedDrinksPrices);

  //   addItem({
  //     id: item.id,
  //     name: item.name,
  //     image: item.image,
  //     price: item.price,
  //     description: item.description,
  //     quantity: quantity,
  //     selectedDrinks: selectedDrinksArray,
  //     selectedSides: selectedSidesArray,
  //     offer: item.offer,
  //     offerPer: item.offerPer,
  //     sides: item.sides,
  //     drinks: item.drinks,
  //     selectedSidesPrices: selectedSidesPrices,
  //     selectedDrinksPrices: selectedDrinksPrices,
  //   });
  //   navigation.navigate("mycart");
  // };

  return (
    <View>
      {/* <Alert
        visible={alertVisible}
        onCancel={() => setAlertVisible(false)}
        onConfirm={() => {
          setAlertVisible(false);
          addItemToCartConfirmed();
        }}
      /> */}
      <View>
        <View
          style={{
            padding: 25,
          
            paddingBottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
        >
      
        </View>
        <ScrollView style={{ padding: 25 }}>
          <View>
            <Image
              source={{ uri: `http://192.168.1.66:8000${item.image}`  }}
              style={{
                width: 300,
                height: 300,
                alignSelf: "center",
                borderRadius: 50,
              }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                marginTop: "5%",
                maxWidth: 250,
              }}
            >
              {item.food_name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                marginLeft: "auto",
                marginRight: 15,
                marginTop: "8%",
              }}
            >
              <TouchableOpacity activeOpacity={0.5} >
                <Icon
                  name="minuscircle"
                  size={18}
                  color="#df2020"
                  style={{ marginRight: 7 }}
                />
              </TouchableOpacity>
{/* 
              <Text style={{ marginRight: 5 }}>{quantity}</Text> */}
              <TouchableOpacity activeOpacity={0.5} >
                <Icon
                  name="pluscircle"
                  size={18}
                  color="#df2020"
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "green",
                fontSize: 18,
                marginTop: "3%",
                fontWeight: "bold",
              }}
            >
              {item.offerPer ? (
                <View style={{ flexDirection: "row",}}>
                  <Text style={{ textDecorationLine: "line-through", }}>
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
            </Text>
            {/* {hasGarlic ? (
              <Text
                style={{
                  marginLeft: "auto",
                  color: "red",
                  fontWeight: "bold",
                  marginTop: 10,
                }}
              >
                This Food Contains Garlic
              </Text>
            ) : null} */}
          </View>
          <Text
            style={{
              color: "black",
              marginTop: "3%",
              fontSize: 18,
            }}
          >
            {item.description}
          </Text>
          <View
            style={{ borderTopWidth: 4, borderColor: "gray", marginTop: "5%" }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginTop: "3%",
              }}
            >
              Add Sides
            </Text>
            <View>
              {/* <PaperProvider theme={theme}>
                {item.sides.map((side, index) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      fontSize: 18,
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <Checkbox
                        status={
                          selectedSides[side.name] ? "checked" : "unchecked"
                        }
                        onPress={() => handleCheckboxChange(side.name)}
                      />
                      <Text style={{ marginLeft: 10 }}>{side.name}</Text>
                    </View>
                    <Text
                      style={{
                        backgroundColor: "white",
                        padding: 5,
                        borderRadius: 5,
                        marginRight: 5,
                        color: "green",
                      }}
                    >
                      Rs. {side.price}
                    </Text>
                  </View>
                ))}
              </PaperProvider> */}
            </View>
            {/* <Text style={{ fontWeight: "bold" }}>{renderSelectedSides()}</Text> */}
          </View>
          <View
            style={{ borderTopWidth: 4, borderColor: "gray", marginTop: "2%" }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginTop: "3%",
              }}
            >
              Add Drinks
            </Text>
            <View>
              {/* <PaperProvider theme={theme}>
                {item.drinks.map((drink, index) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      fontSize: 18,
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <Checkbox
                        status={
                          selectedDrinks[drink.name] ? "checked" : "unchecked"
                        }
                        onPress={() => handleCheckboxChangeDrink(drink.name)}
                      />
                      <Text style={{ marginLeft: 10 }}>{drink.name}</Text>
                    </View>
                    <Text
                      style={{
                        backgroundColor: "white",
                        padding: 5,
                        borderRadius: 5,
                        marginRight: 5,
                        color: "green",
                      }}
                    >
                      Rs. {drink.price}
                    </Text>
                  </View>
                ))}
              </PaperProvider> */}
            </View>
            {/* <Text style={{ fontWeight: "bold" }}>{renderSelectedDrinks()}</Text> */}
          </View>
          <View
            style={{ borderTopWidth: 4, borderColor: "gray", marginTop: "2%" }}
          >
       <GlobalButton name="Add to Cart" onPress={()=>""} />
           
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Food_description;
