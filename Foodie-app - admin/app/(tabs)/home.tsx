import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Dimensions
} from 'react-native';
import {
  BarChart,
  LineChart
} from 'react-native-chart-kit';
import {
  Home,
  Menu,
  ShoppingBag,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Calendar,
  Bell
} from 'lucide-react-native';

const home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('day');
  const [notificationCount, setNotificationCount] = useState(5);
  
  // Mock data - would be replaced with actual API calls
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 12759.85,
    todayRevenue: 1842.50,
    pendingOrders: 7,
    completedOrders: 32,
    canceledOrders: 2,
    averageRating: 4.7,
    topSellingItems: [
      { id: 1, name: 'Margherita Pizza', quantity: 28, image:" require('@/image/pizza.jpg')" },
      { id: 2, name: 'Chicken Burger', quantity: 24, image:" require('@/image/burger.jpg') "},
      { id: 3, name: 'Caesar Salad', quantity: 18, image: "require('@/image/salad.jpg')" },
    ],
    recentOrders: [
      { id: 'ORD-7845', customer: 'John Doe', total: 38.50, status: 'Delivered', time: '15 min ago' },
      { id: 'ORD-7844', customer: 'Jane Smith', total: 52.75, status: 'Preparing', time: '28 min ago' },
      { id: 'ORD-7843', customer: 'Robert Johnson', total: 24.99, status: 'Pending', time: '45 min ago' },
      { id: 'ORD-7842', customer: 'Emily Davis', total: 68.20, status: 'Delivered', time: '1 hour ago' },
    ],
    lowStockItems: [
      { id: 1, name: 'Tomatoes', quantity: 3, unit: 'kg' },
      { id: 2, name: 'Chicken Breast', quantity: 2, unit: 'kg' },
      { id: 3, name: 'Mozzarella', quantity: 1, unit: 'kg' },
    ]
  });

  const salesData = {
    day: {
      labels: ['9AM', '12PM', '3PM', '6PM', '9PM'],
      datasets: [
        {
          data: [580.50, 892.25, 765.80, 1205.30, 982.75],
          color: (opacity = 1) => `rgba(223, 32, 32, ${opacity})`,
          strokeWidth: 2
        }
      ],
    },
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [3250.75, 2980.50, 3420.25, 3780.50, 4250.75, 5320.25, 4780.50],
          color: (opacity = 1) => `rgba(223, 32, 32, ${opacity})`,
          strokeWidth: 2
        }
      ],
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          data: [12580.50, 14325.75, 13980.25, 15290.50],
          color: (opacity = 1) => `rgba(223, 32, 32, ${opacity})`,
          strokeWidth: 2
        }
      ],
    }
  };

  const categoryData = {
    labels: ['Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Drinks'],
    datasets: [
      {
        data: [32, 28, 19, 15, 12, 18]
      }
    ]
  };

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(223, 32, 32, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#df2020'
    }
  };

  const fetchDashboardData = async () => {
    // In a real app, this would be an API call
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // The data is already set in the state initialization above
      setIsLoading(false);
    }, 1500);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return '#2ecc71';
      case 'Preparing':
        return '#f39c12';
      case 'Pending':
        return '#3498db';
      case 'Canceled':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#df2020" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#df2020" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Foodie Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={22} color="#fff" />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#df2020"]}
            tintColor="#df2020"
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <DollarSign size={24} color="#df2020" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <Text style={styles.summaryValue}>Rs{dashboardData.totalRevenue.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <ShoppingBag size={24} color="#df2020" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Today's Orders</Text>
              <Text style={styles.summaryValue}>{dashboardData.pendingOrders + dashboardData.completedOrders}</Text>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Star size={24} color="#df2020" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Avg. Rating</Text>
              <Text style={styles.summaryValue}>{dashboardData.averageRating}</Text>
            </View>
          </View>
        </View>
        
        {/* Orders Status */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Orders Status</Text>
          <View style={styles.orderStatusContainer}>
            <View style={styles.orderStatusItem}>
              <View style={[styles.orderStatusIcon, { backgroundColor: '#3498db' }]}>
                <Clock size={22} color="#fff" />
              </View>
              <Text style={styles.orderStatusValue}>{dashboardData.pendingOrders}</Text>
              <Text style={styles.orderStatusLabel}>Pending</Text>
            </View>
            
            <View style={styles.orderStatusItem}>
              <View style={[styles.orderStatusIcon, { backgroundColor: '#2ecc71' }]}>
                <ShoppingBag size={22} color="#fff" />
              </View>
              <Text style={styles.orderStatusValue}>{dashboardData.completedOrders}</Text>
              <Text style={styles.orderStatusLabel}>Completed</Text>
            </View>
            
            <View style={styles.orderStatusItem}>
              <View style={[styles.orderStatusIcon, { backgroundColor: '#e74c3c' }]}>
                <AlertTriangle size={22} color="#fff" />
              </View>
              <Text style={styles.orderStatusValue}>{dashboardData.canceledOrders}</Text>
              <Text style={styles.orderStatusLabel}>Canceled</Text>
            </View>
          </View>
        </View>
        
        {/* Sales Chart */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sales Overview</Text>
            <View style={styles.tabSelector}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'day' && styles.activeTab]} 
                onPress={() => setActiveTab('day')}
              >
                <Text style={[styles.tabText, activeTab === 'day' && styles.activeTabText]}>Day</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'week' && styles.activeTab]} 
                onPress={() => setActiveTab('week')}
              >
                <Text style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}>Week</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'month' && styles.activeTab]} 
                onPress={() => setActiveTab('month')}
              >
                <Text style={[styles.tabText, activeTab === 'month' && styles.activeTabText]}>Month</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={salesData[activeTab]}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>
        
        {/* Top Selling Items */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Selling Items</Text>
          
          {dashboardData.topSellingItems.map((item) => (
            <View key={item.id} style={styles.topItemCard}>
              {/* <Image source={item.image} style={styles.itemImage} /> */}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>{item.quantity} orders</Text>
              </View>
              <View style={styles.itemRank}>
                <Text style={styles.itemRankText}>#{dashboardData.topSellingItems.indexOf(item) + 1}</Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Menu Items</Text>
            <ChevronRight size={16} color="#df2020" />
          </TouchableOpacity>
        </View>
        
        {/* Sales by Category */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sales by Category</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={categoryData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
            />
          </View>
        </View>
        
        {/* Recent Orders */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          
          {dashboardData.recentOrders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderCardLeft}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
                <Text style={styles.orderTime}>{order.time}</Text>
              </View>
              <View style={styles.orderCardRight}>
                <Text style={styles.orderTotal}>Rs{order.total.toFixed(2)}</Text>
                <View style={[styles.orderStatusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.orderStatusText}>{order.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Orders</Text>
            <ChevronRight size={16} color="#df2020" />
          </TouchableOpacity>
        </View>
        
       
      </ScrollView>
      
 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 80,
    marginTop:40
  },
  
  // Header styles
  header: {
    backgroundColor: '#df2020',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  headerRight: {
    flexDirection: 'row',
  },
  notificationButton: {
    marginRight: 15,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#df2020',
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsButton: {},
  
  // Summary cards
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: -25,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIconContainer: {
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Section styles
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  
  // Tab selector
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 3,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 17,
  },
  activeTab: {
    backgroundColor: '#df2020',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '500',
  },
  
  // Order status
  orderStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  orderStatusItem: {
    alignItems: 'center',
  },
  orderStatusIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderStatusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderStatusLabel: {
    fontSize: 12,
    color: '#666',
  },
  
  // Chart
  chartContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  chart: {
    borderRadius: 12,
  },
  
  // Top selling items
  topItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemRank: {
    backgroundColor: '#df2020',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemRankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  
  // View all button
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#df2020',
    fontWeight: '500',
    marginRight: 5,
  },
  
  // Orders
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderCardLeft: {},
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderCustomer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
  },
  orderCardRight: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  orderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Alerts
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#e74c3c',
  },
  alertIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertDetails: {
    flex: 1,
    marginLeft: 12,
  },
  alertItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  alertItemQuantity: {
    fontSize: 13,
    color: '#e74c3c',
  },
  alertActionButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  alertActionButtonText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  quickActionButton: {
    backgroundColor: '#fff',
    width: '22%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },
  activeNavButton: {
    borderTopWidth: 3,
    borderTopColor: '#df2020',
    paddingTop: 12,
  },
});

export default home;