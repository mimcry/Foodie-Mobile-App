import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { FoodTitle } from "../global";
import { FoodCard } from "../global";
import ipAddress from "../global";
import { FoodCardProps } from "@/utils";
import { getAccessToken } from "@/utils/access_Token";
const OfferCard = () => {
  const [offers, setOffers] = useState<FoodCardProps[]>([]);
  const navigation = useNavigation();

  const fetchOffers = async () => {
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
      const data = await response.json();

      const offerItems = data.filter((item: { offer: any }) => {

        return item.offer > 0;
      });
      setOffers(offerItems);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const FoodDescription = (item: FoodCardProps) => {
    // navigation.navigate("fooddescription", { item });
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <FoodTitle Topic="Offer" Title="Foods" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexDirection: "row", marginTop: "5%" }}
      >
        {offers.map((item, index) => (
          <FoodCard
            key={index}
            image={item.image}
            food_name={item.food_name}
            price={item.price}
            item={item}
            description={item.description}
            food_id={item.food_id}
            offer={item.offer}
            tags={item.tags}
            onPress={() => FoodDescription(item)}
            sides={item.sides}
            drinks={item.drinks}
            ingredients={item.ingredients}
            sidesprice={item.sidesprice}
            drinkprice={item.drinkprice}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default OfferCard;
