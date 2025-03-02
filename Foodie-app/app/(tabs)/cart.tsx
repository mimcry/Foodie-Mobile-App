import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import { AntDesign, Feather, MaterialIcons,} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootState } from "@/redux/store";
import { clearCart, removeFromCart, updateQuantity } from "@/redux/cartSlice";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CartScreen = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const isCartEmpty = cartItems.length === 0;

  const handleSubmit = async (event:any) => {
    const userId = await AsyncStorage.getItem("userId");
    const access_token = await AsyncStorage.getItem("accessToken");
    event.preventDefault();

    const orderData = {
      user_id: userId,
      total_amount: total,
      items: cartItems.map(item => ({
        food_item_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const response = await fetch('http://192.168.1.66:8000/orderitems', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer Rs{access_token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Order placed successfully!');
        console.log(result);
      } else {
        throw new Error('Failed to place the order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error placing order');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {isCartEmpty ? (
        <View style={styles.emptyCartContainer}>
          <View style={styles.emptyCartIconContainer}>
            <MaterialIcons name="shopping-cart" size={80} color="#DDDDDD" />
          </View>
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartMessage}>
            Look like you haven't added anything to your cart yet
          </Text>
          <TouchableOpacity style={styles.startShoppingButton}>
            <Text style={styles.startShoppingButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Restaurant Section */}
          <View style={styles.restaurantSection}>
            <Text style={styles.sectionTitle}>Your Items</Text>
            <TouchableOpacity
              
              onPress={() => dispatch(clearCart())}
            >
              <Text style={{ padding: 8, color: "#df2020",fontWeight:700 }}>Clear Cart</Text>
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.cartItemsContainer}
          >
            {cartItems.map((item, index) => (
              <View key={item.id}>
                {index > 0 && <View style={styles.itemDivider} />}
                <View style={styles.cartItem}>
                  <Image
                    source={{ uri: `http://192.168.1.66:8000${item.image}` }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemDetails}>
                    <View style={styles.itemHeaderRow}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => dispatch(removeFromCart(item.id))}
                      >
                        <Feather name="trash-2" size={18} color="#df2020" />
                      </TouchableOpacity>
                    </View>

                    {item.description && (
                      <Text style={styles.itemOptions} ellipsizeMode="tail" numberOfLines={2}>{item.description}</Text>
                    )}
                    <View style={styles.itemFooter}>
                      <Text style={styles.itemPrice}>
                        Rs{(item.price * item.quantity).toFixed(2)}
                      </Text>
                      <View style={styles.quantitySelector}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                        >
                          <AntDesign name="minus" size={16} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          <AntDesign name="plus" size={16} color="black" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
<View style={{borderBottomColor:"gray", borderBottomWidth:1}}></View>
<View style={styles.promoContainer}>
              <View style={styles.promoInputContainer2}>
              <MaterialCommunityIcons
        name="notebook" // This is the name of the icon
        size={20} // You can adjust the size of the icon
        color="gray" // You can adjust the color of the icon
      />
                <Text style={styles.promoPlaceholder}>Additional note</Text>
              </View>

            </View>
            {/* Promo Code Section */}
            <View style={styles.promoContainer}>
              <View style={styles.promoInputContainer}>
                <MaterialIcons name="local-offer" size={20} color="#666" />
                <TextInput style={styles.promoPlaceholder} placeholder="Add promo code"></TextInput>
              </View>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
            
            {/* Order Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>Rs{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>
                  Rs{deliveryFee.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>Rs{tax.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>Rs{total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Space for the bottom button */}
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Checkout Button */}
          <View style={styles.checkoutContainer}>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleSubmit}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <View style={styles.checkoutButtonIcon}>
                <AntDesign name="arrowright" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyCartIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#df2020",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyCartMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  startShoppingButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  startShoppingButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  restaurantSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  restaurantCount: {
    fontSize: 14,
    color: "#666",
  },
  cartItemsContainer: {
    paddingHorizontal: 16,
  },
  itemDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  cartItem: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 14,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  restaurantName: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  itemOptions: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FA",
    borderRadius: 8,
    overflow: "hidden",
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    width: 24,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  promoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  promoInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 2,
    backgroundColor: "#F6F8FA",
    borderRadius: 10,
    marginRight: 10,
  },
  promoInputContainer2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#F6F8FA",
    borderRadius: 10,
    marginRight: 10,
  },
  promoPlaceholder: {
    color: "#999",
    marginLeft: 8,
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: "#F6F8FA",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  applyButtonText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 14,
  },
  summaryContainer: {
    backgroundColor: "#F6F8FA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#666",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  checkoutContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutButton: {
    backgroundColor: "#df2020",
    borderRadius: 14,
    height: 54,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  checkoutButtonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CartScreen;
