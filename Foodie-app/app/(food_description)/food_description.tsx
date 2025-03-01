import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch } from "react-redux";
import { addToCart } from '@/redux/cartSlice';
const FoodDescriptionScreen = () => {


  const params = useLocalSearchParams();
  console.log("params ",params )
  const item = typeof params.item === 'string' ? JSON.parse(params.item) : null;
  const [quantity, setQuantity] = useState(2);
  const [favorite, setFavorite] = useState(false);
  const scrollY = new Animated.Value(0);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
const dispatch= useDispatch();
const handleAddCart =(item:any)=>{
  dispatch(addToCart({
    id: item.food_id,
    name: item.food_name,
    price: item.price,
    image:item.image,
    description:item.description,
    quantity: 2,
  }))
}
  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <Text style={styles.animatedHeaderText} numberOfLines={1}>{item.name}</Text>
      </Animated.View>

      {/* Static Header */}
      <View style={styles.header}>
       
        
        <TouchableOpacity onPress={() => {}} style={styles.shareButton}>
          <Feather name="share" size={22} color="black" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Food Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri:`http://192.168.1.66:8000${item.image}`  }}
            style={styles.foodImage}
            
          />
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => setFavorite(!favorite)}
          >
            <AntDesign name={favorite ? "heart" : "hearto"} size={22} color={favorite ? "#FF4545" : "black"} />
          </TouchableOpacity>
        </View>

        {/* Food Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.foodName}>{item.food_name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>${item.price}</Text>
            </View>
          </View>

          {/* Rating and Time */}
          <View style={styles.infoRow}>
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={16} color="#FFC107" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.ratingCount}>({item.ratingCount} reviews)</Text>
            </View>
            <View style={styles.timeContainer}>
              <Feather name="clock" size={16} color="#666" />
              <Text style={styles.timeText}>{item.cookTime}</Text>
            </View>
            <View style={styles.caloriesContainer}>
              <MaterialCommunityIcons name="fire" size={16} color="#FF6B6B" />
              <Text style={styles.caloriesText}>{item.calories} cal</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>

          {/* Ingredients */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {/* <View style={styles.ingredientsList}>
              {item.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View> */}
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                <AntDesign name="minus" size={20} color={quantity > 1 ? "black" : "#CCCCCC"} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                <AntDesign name="plus" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Spacer for bottom button */}
          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.addToCartContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddCart(item)}>
          <Text style={styles.addToCartText}>Add to Cart - ${(item.price * quantity).toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  animatedHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:"auto"
  },
  imageContainer: {
    width: '100%',
    height: 350,
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  priceContainer: {
    backgroundColor: '#df2020',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#Fff',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  ingredientsList: {
    marginTop: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 15,
    color: '#444',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  quantityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    height: 40,
  },
  quantityButton: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
  addToCartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  addToCartButton: {
    backgroundColor: '#df2020',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodDescriptionScreen;