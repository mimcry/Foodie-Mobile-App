import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
} from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import handelTokenExpiry from "@/utils/handelRefresh";
import { addToCart } from "@/redux/cartSlice";
import { useDispatch } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { router } from "expo-router";


const CustomStarRating = ({ rating, setRating, starSize = 30 }: { rating: number, setRating: (rating: number) => void, starSize?: number }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity 
          key={star}
          onPress={() => setRating(star)}
          style={{ padding: 5 }}
        >
          <AntDesign
            name={rating >= star ? "star" : "staro"}
            size={starSize}
            color={rating >= star ? "#FFD700" : "#CCCCCC"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const PastOrdersScreen = () => {
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [rating, setRating] = useState(0);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [currentOrderToRate, setCurrentOrderToRate] = useState(null);
  const [feedback, setFeedback] = useState("");
  
  const dispatch = useDispatch();
  const toast = useToast();
  
  const orderdetails = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const access_token = await AsyncStorage.getItem("accessToken");

    if (!access_token) {
      setError("No token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.1.70:8000/${userId}/orderitems`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.log("Token expired or invalid.");
          handelTokenExpiry();
          return;
        }

        const errorText = await response.text();
        console.error(`Server error: ${response.status}`, errorText);
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order profile");
    }
  };

  useEffect(() => {
    orderdetails();
  }, []);

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  
  const openRatingModal = (order) => {
    setCurrentOrderToRate(order);
    setRating(0);
    setFeedback("");
    setRatingModalVisible(true);
  };
  
  
  const submitRating = async (orderItems) => {
  
  
    if (!currentOrderToRate) return;
  
    try {
      const userId = await AsyncStorage.getItem("userId");
      const access_token = await AsyncStorage.getItem("accessToken");
  
    
      orderItems.forEach(async (item) => {
        const foodItemId = item.food_item_id; 
        const response = await fetch(
          `http://192.168.1.70:8000/fooddetails/foodratings`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
              
            },
            body: JSON.stringify({
              food_id: foodItemId, 
              user_id: userId,
              rating: rating,
              review: feedback
            })
          }
        );
  console.log("food response",{ foodId: foodItemId,
    userId: userId,
    rating: rating,
    feedback: feedback})
        if (!response.ok) {
          throw new Error(`Failed to submit rating: ${response.status}`);
        }
  
        // Show success message
        toast.show("Thank you for your rating!", {
          type: "success",
          animationType: "slide-in",
          style: {
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
          },
         
        });
  
        // Close the modal after submitting the rating
        setRatingModalVisible(false);
      });
  
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.show("Failed to submit rating. Please try again.", {
        type: "error",
        animationType: "slide-in",
        style: {
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 10,
        },
      });
    }
  };
  
 
  const renderOrderItem = ({ item: order }) => {
    const isExpanded = expandedOrderId === order.order_id;
    const dateStr = order.order_date;
    const date = new Date(dateStr);

    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    
    const handleAddToCart = (orderItems:any) => {
      orderItems.forEach((item:any) => {
        dispatch(
          addToCart({
            id: item.food_item_id,
            name: item.food_name,
            price: item.price,
            image: item.image,
            description: item.description,
            quantity: item.quantity,
          })
        );
      });
      console.log("All items from the order added to the cart.");
      toast.show("Reorder was Sucessfull ", {
        type: "success",
        animationType: "slide-in",
        style: {
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 10,
        },
      });
      router.push("/(tabs)/cart")
    };

    return (
      <View style={styles.orderCard}>
    
        <TouchableOpacity style={styles.orderHeader} activeOpacity={0.7}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>
              {order.items.map((item) => item.food_name).join(", ")}
            </Text>
            <View style={styles.orderDateContainer}>
              <View style={{ flexDirection: "row" }}>
                <Feather
                  name="calendar"
                  size={14}
                  color="#666"
                  style={{ marginTop: 3 }}
                />
                <Text style={styles.orderDate}> {formattedDate}</Text>
              </View>
              <View style={{ flexDirection: "row", marginLeft: 15 }}>
                <Feather
                  name="clock"
                  size={14}
                  color="#666"
                  style={{ marginTop: 3 }}
                />
                <Text style={styles.orderDate}> {formattedTime}</Text>
              </View>
            </View>
          </View>

          <View style={styles.orderStatusContainer}>
            <View style={styles.statusIndicator}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
            <Text style={styles.orderTotal}>${order.total_amount}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => toggleOrderDetails(order.order_id)}>
          <View style={styles.restaurantRow}>
            <Text style={styles.restaurantName}>Food items</Text>
            <View style={styles.expandIconContainer}>
              <AntDesign
                name={isExpanded ? "up" : "down"}
                size={14}
                color="#666"
              />
            </View>
          </View>
        </TouchableOpacity>


        {isExpanded && (
          <View style={styles.orderDetails}>
       
            {order.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Image
                  source={{ uri: `http://192.168.1.70:8000${item.image}` }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.food_name}
                  </Text>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemQuantity}>
                      {item.quantity}x ${item.price}
                    </Text>
                    <Text style={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.reorderButton]}
                onPress={() => handleAddToCart(order.items)}
              >
                <Feather name="refresh-cw" size={16} color="white" />
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.rateButton]}
                onPress={() => openRatingModal(order)}
              >
                <AntDesign name="star" size={16} color="#f5e74e" />
                <Text style={styles.rateButtonText}>Rate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.helpButton]}
              >
                <Feather name="help-circle" size={16} color="#555" />
                <Text style={styles.helpButtonText}>Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.order_id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
     
      <Modal
        animationType="slide"
        transparent={true}
        visible={ratingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate Your Order</Text>
              <TouchableOpacity
                onPress={() => setRatingModalVisible(false)}
                style={styles.closeButton}
              >
                <AntDesign name="close" size={20} color="#555" />
              </TouchableOpacity>
            </View>
            
            {currentOrderToRate && (
              <Text style={styles.orderItemsText}>
                {currentOrderToRate.items.map(item => item.food_name).join(', ')}
              </Text>
            )}
            
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>How was your experience?</Text>
              <CustomStarRating
                rating={rating}
                setRating={setRating}
                starSize={40}
              />
              <Text style={styles.ratingValueText}>
                {rating === 0
                  ? "Tap to rate"
                  : rating === 1
                  ? "Poor"
                  : rating === 2
                  ? "Fair"
                  : rating === 3
                  ? "Good"
                  : rating === 4
                  ? "Very Good"
                  : "Excellent"}
              </Text>
            </View>
            
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackLabel}>Additional Comments</Text>
              <TextInput
                style={styles.feedbackInput}
                multiline
                placeholder="Tell us more about your experience..."
                value={feedback}
                onChangeText={setFeedback}
                maxLength={250}
              />
            </View>
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                rating === 0 && styles.submitButtonDisabled
              ]}
              onPress={() => currentOrderToRate && submitRating(currentOrderToRate.items)}

              disabled={rating === 0}
            >
              <Text style={styles.submitButtonText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  emptyView: {
    width: 40,
  },
  emptyOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyOrdersIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F6F8FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyOrdersTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyOrdersMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  browseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  ordersList: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  orderDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  orderStatusContainer: {
    alignItems: "flex-end",
  },
  statusIndicator: {
    backgroundColor: "#E5F8ED",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22A45D",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "700",
  },
  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginLeft: 6,
    flex: 1,
  },
  expandIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  orderDetails: {
    padding: 16,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemQuantity: {
    fontSize: 13,
    color: "#666",
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: "auto",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  reorderButton: {
    backgroundColor: "#df2020",
  },
  reorderButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  rateButton: {
    backgroundColor: "#F6F8FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  rateButtonText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  helpButton: {
    backgroundColor: "#F6F8FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  helpButtonText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  orderItemsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  ratingContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  ratingValueText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  feedbackContainer: {
    marginVertical: 16,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#df2020',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PastOrdersScreen;