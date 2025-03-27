import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { getAccessToken } from "@/utils/access_Token";
import { 
  Clock, 
  CheckCircle, 
  TruckIcon, 
  ShoppingBag, 
  AlertCircle,
  ArrowRightCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  User,
} from 'lucide-react-native';

// Order status types
const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered'
};

// Mock order item interface
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  image?: string;
}

// Order interface
interface Order {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  order_time: string;
  order_date: string;
  total_amount: string;
  status: string;
  items: OrderItem[];
  payment_method?: string;
  special_instructions?: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(ORDER_STATUS.PENDING);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch orders from API
  const fetchOrders = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    
    try {
      const access_token = await getAccessToken();
      
      // Replace with your actual API endpoint
      const response = await fetch("http://192.168.1.70:8000/orders/all", {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // For demo purposes, using mock data
  const loadMockOrders = () => {
    const mockOrders: Order[] = [
      {
        order_id: "ORD12345",
        customer_name: "Rahul Sharma",
        customer_phone: "9876543210",
        customer_address: "123 Main St, Sallghari, Bhaktapur",
        order_time: "12:30 PM",
        order_date: "Mar 2, 2025",
        total_amount: "450",
        status: ORDER_STATUS.PENDING,
        payment_method: "Cash Payment",
        items: [
          { id: "1", name: "Butter Chicken", quantity: 1, price: "250", image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/02/butter-chicken-ac2ff98.jpg?quality=90&resize=440,400" },
          { id: "2", name: "Garlic Naan", quantity: 2, price: "100", image: "https://hostthetoast.com/wp-content/uploads/2018/08/naan-202-320x320-1.jpg" },
        ],
        special_instructions: "Extra spicy please"
      },
      {
        order_id: "ORD12346",
        customer_name: "Priya Patel",
        customer_phone: "9876543211",
        customer_address: "456 Park Avenue, Indiranagar, Bangalore",
        order_time: "11:45 AM",
        order_date: "Mar 2, 2025",
        total_amount: "680",
        status: ORDER_STATUS.PENDING,
        payment_method: "Cash on Delivery",
        items: [
          { id: "3", name: "Paneer Pizza", quantity: 1, price: "350", image: "https://via.placeholder.com/50" },
          { id: "4", name: "Cold Drink", quantity: 2, price: "120", image: "https://via.placeholder.com/50" },
          { id: "5", name: "French Fries", quantity: 1, price: "90", image: "https://via.placeholder.com/50" },
        ]
      },
      {
        order_id: "ORD12347",
        customer_name: "Amit Kumar",
        customer_phone: "9876543212",
        customer_address: "789 Lake View, HSR Layout, Bangalore",
        order_time: "10:15 AM",
        order_date: "Mar 2, 2025",
        total_amount: "520",
        status: ORDER_STATUS.PREPARING,
        payment_method: "Online Payment",
        items: [
          { id: "6", name: "Veg Biryani", quantity: 2, price: "240", image: "https://via.placeholder.com/50" },
          { id: "7", name: "Raita", quantity: 1, price: "40", image: "https://via.placeholder.com/50" },
        ]
      },
      {
        order_id: "ORD12348",
        customer_name: "Neha Singh",
        customer_phone: "9876543213",
        customer_address: "101 Brigade Road, Bangalore",
        order_time: "9:30 AM",
        order_date: "Mar 2, 2025",
        total_amount: "750",
        status: ORDER_STATUS.DELIVERING,
        payment_method: "Online Payment",
        items: [
          { id: "8", name: "Chicken Biryani", quantity: 2, price: "600", image: "https://via.placeholder.com/50" },
          { id: "9", name: "Sweet Lassi", quantity: 2, price: "150", image: "https://via.placeholder.com/50" },
        ]
      },
      {
        order_id: "ORD12349",
        customer_name: "Vikram Reddy",
        customer_phone: "+91 9876543214",
        customer_address: "222 MG Road, Bangalore",
        order_time: "8:45 AM",
        order_date: "Mar 2, 2025",
        total_amount: "420",
        status: ORDER_STATUS.DELIVERED,
        payment_method: "Cash on Delivery",
        items: [
          { id: "10", name: "Masala Dosa", quantity: 3, price: "300", image: "https://via.placeholder.com/50" },
          { id: "11", name: "Filter Coffee", quantity: 2, price: "120", image: "https://via.placeholder.com/50" },
        ]
      },
    ];
    
    setOrders(mockOrders);
    setLoading(false);
    setRefreshing(false);
  };
  
  useEffect(() => {
    // Uncomment the line below to fetch real data
    // fetchOrders();
    
    // Using mock data for demo
    loadMockOrders();
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    // Uncomment the line below to fetch real data
    // fetchOrders(false);
    
    // Using mock data for demo
    setTimeout(() => {
      loadMockOrders();
    }, 1000);
  };
  
  // Update order status - this would call your API in a real app
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // Show confirmation alert
    Alert.alert(
      "Update Order Status",
      `Are you sure you want to move this order to ${newStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Update", 
          onPress: async () => {
            try {
              // In a real app, you would call your API here
              // const access_token = await getAccessToken();
              // const response = await fetch(`http://192.168.1.70:8000/orders/${orderId}/status`, {
              //   method: "PUT",
              //   headers: { 
              //     Authorization: `Bearer ${access_token}`,
              //     "Content-Type": "application/json"
              //   },
              //   body: JSON.stringify({ status: newStatus })
              // });
              
              // if (!response.ok) throw new Error("Failed to update order status");
              
              // For demo, update locally
              setOrders(orders.map(order => 
                order.order_id === orderId 
                  ? {...order, status: newStatus} 
                  : order
              ));
              
              Alert.alert("Success", `Order status updated to ${newStatus}`);
            } catch (error) {
              console.error("Error updating order status:", error);
              Alert.alert("Error", "Failed to update order status. Please try again.");
            }
          }
        }
      ]
    );
  };
  
  // Get next status based on current status
  const getNextStatus = (currentStatus: string) => {
    switch(currentStatus) {
      case ORDER_STATUS.PENDING:
        return ORDER_STATUS.PREPARING;
      case ORDER_STATUS.PREPARING:
        return ORDER_STATUS.DELIVERING;
      case ORDER_STATUS.DELIVERING:
        return ORDER_STATUS.DELIVERED;
      default:
        return null;
    }
  };
  
  // Status tab component
  const StatusTab = ({ status, label, icon, count }) => (
    <TouchableOpacity
      style={[
        styles.statusTab,
        activeTab === status && styles.statusTabActive
      ]}
      onPress={() => setActiveTab(status)}
    >
      {icon}
      <Text style={[
        styles.statusTabText,
        activeTab === status && styles.statusTabTextActive
      ]}>
        {label}
      </Text>
      <View style={[
        styles.statusTabBadge,
        activeTab === status && styles.statusTabBadgeActive
      ]}>
        <Text style={[
          styles.statusTabBadgeText,
          activeTab === status && styles.statusTabBadgeTextActive
        ]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  // Order card component
  const OrderCard = ({ order }: { order: Order }) => {
    const isExpanded = expandedOrder === order.order_id;
    const nextStatus = getNextStatus(order.status);
    
    return (
      <View style={styles.orderCard}>
        <TouchableOpacity 
          style={styles.orderCardHeader}
          onPress={() => setExpandedOrder(isExpanded ? null : order.order_id)}
        >
          <View style={styles.orderBasicInfo}>
            <Text style={styles.orderId}>{order.order_id}</Text>
            <View style={styles.orderTimeContainer}>
              <Calendar size={14} color="#777" />
              <Text style={styles.orderTime}>{order.order_date} • {order.order_time}</Text>
            </View>
          </View>
          
          <View style={styles.orderHeaderRight}>
            <View style={styles.amountContainer}>
           
              <Text style={styles.orderAmount}>Rs{order.total_amount}</Text>
            </View>
            {isExpanded ? (
              <ChevronUp size={20} color="#777" />
            ) : (
              <ChevronDown size={20} color="#777" />
            )}
          </View>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.orderCardExpanded}>
            <View style={styles.customerInfo}>
              <View style={styles.customerInfoRow}>
                <User size={16} color="#777" />
                <Text style={styles.customerInfoText}>{order.customer_name}</Text>
              </View>
              <View style={styles.customerInfoRow}>
                <Phone size={16} color="#777" />
                <Text style={styles.customerInfoText}>{order.customer_phone}</Text>
              </View>
              <View style={styles.customerInfoRow}>
                <MapPin size={16} color="#777" />
                <Text style={styles.customerInfoText}>{order.customer_address}</Text>
              </View>
            </View>
            
            <View style={styles.itemListHeader}>
              <Text style={styles.itemListTitle}>Order Items</Text>
              <Text style={styles.itemListCount}>{order.items.length} items</Text>
            </View>
            
            <View style={styles.itemList}>
              {order.items.map((item, index) => (
                <View key={item.id} style={styles.orderItem}>
                  {item.image && (
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.itemImage} 
                    />
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>Rs{item.price} × {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    Rs{(parseInt(item.price) * item.quantity).toString()}
                  </Text>
                </View>
              ))}
            </View>
            
            {order.special_instructions && (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsLabel}>Special Instructions:</Text>
                <Text style={styles.instructionsText}>{order.special_instructions}</Text>
              </View>
            )}
            
            <View style={styles.paymentInfoContainer}>
              <Text style={styles.paymentMethod}>
                Payment: {order.payment_method || "Not specified"}
              </Text>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalAmount}>Rs{order.total_amount}</Text>
              </View>
            </View>
            
            {nextStatus && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => updateOrderStatus(order.order_id, nextStatus)}
              >
                <Text style={styles.actionButtonText}>
                  {order.status === ORDER_STATUS.PENDING ? "Accept & Start Preparing" :
                   order.status === ORDER_STATUS.PREPARING ? "Send for Delivery" :
                   order.status === ORDER_STATUS.DELIVERING ? "Mark as Delivered" : ""}
                </Text>
                <ArrowRightCircle size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {!isExpanded && nextStatus && (
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => updateOrderStatus(order.order_id, nextStatus)}
          >
            <Text style={styles.quickActionButtonText}>
              {order.status === ORDER_STATUS.PENDING ? "Accept" :
               order.status === ORDER_STATUS.PREPARING ? "Send" :
               order.status === ORDER_STATUS.DELIVERING ? "Delivered" : ""}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  // Count orders by status
  const getOrderCountByStatus = (status) => {
    return orders.filter(order => order.status === status).length;
  };
  
  // Filtered orders based on active tab
  const filteredOrders = orders.filter(order => order.status === activeTab);
  
  return (
    <View style={styles.container}>
    
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.statusTabsContainer}
        contentContainerStyle={styles.statusTabs}
      >
        <StatusTab 
          status={ORDER_STATUS.PENDING} 
          label="Pending" 
          icon={<Clock size={18} color={activeTab === ORDER_STATUS.PENDING ? "#fff" : "#777"} />}
          count={getOrderCountByStatus(ORDER_STATUS.PENDING)}
        />
        <StatusTab 
          status={ORDER_STATUS.PREPARING} 
          label="Preparing" 
          icon={<ShoppingBag size={18} color={activeTab === ORDER_STATUS.PREPARING ? "#fff" : "#777"} />}
          count={getOrderCountByStatus(ORDER_STATUS.PREPARING)}
        />
        <StatusTab 
          status={ORDER_STATUS.DELIVERING} 
          label="Delivering" 
          icon={<TruckIcon size={18} color={activeTab === ORDER_STATUS.DELIVERING ? "#fff" : "#777"} />}
          count={getOrderCountByStatus(ORDER_STATUS.DELIVERING)}
        />
        <StatusTab 
          status={ORDER_STATUS.DELIVERED} 
          label="Delivered" 
          icon={<CheckCircle size={18} color={activeTab === ORDER_STATUS.DELIVERED ? "#fff" : "#777"} />}
          count={getOrderCountByStatus(ORDER_STATUS.DELIVERED)}
        />
      </ScrollView>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#df2020" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={40} color="#df2020" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchOrders()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={50} color="#ccc" />
          <Text style={styles.emptyText}>No {activeTab} orders found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.order_id}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={styles.ordersList}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#df2020"]}
              tintColor="#df2020"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statusTabsContainer: {
   
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
   
  },
  statusTabs: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  statusTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    height:50
  },
  statusTabActive: {
    backgroundColor: "#df2020",
  },
  statusTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginLeft: 6,
  },
  statusTabTextActive: {
    color: "#fff",
  },
  statusTabBadge: {
    backgroundColor: "#fff",
    height: 20,
    minWidth: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  statusTabBadgeActive: {
    backgroundColor: "#fff",
  },
  statusTabBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#df2020",
  },
  statusTabBadgeTextActive: {
    color: "#df2020",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#777",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#777",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#df2020",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    marginTop: 16,
    textAlign: "center",
  },
  ordersList: {
    padding: 16,
    paddingBottom: 24,
  
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  orderBasicInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  orderTime: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },
  orderHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#df2020",
    marginLeft: 2,
  },
  orderCardExpanded: {
    padding: 16,
  },
  customerInfo: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  customerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  customerInfoText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
    flex: 1,
  },
  itemListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemListTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemListCount: {
    fontSize: 14,
    color: "#777",
  },
  itemList: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  itemPrice: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  instructionsContainer: {
    backgroundColor: "#fff9e6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#ffc107",
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: "#555",
  },
  paymentInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f2",
    marginBottom: 16,
  },
  paymentMethod: {
    fontSize: 14,
    color: "#555",
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#555",
    marginRight: 6,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#df2020",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#df2020",
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
  quickActionButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#df2020",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quickActionButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default OrderManagement;