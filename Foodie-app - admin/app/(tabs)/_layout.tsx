import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, View,Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@/constants/icons';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { ArrowLeft } from 'lucide-react-native';

// const TabIcon = ({ name, color, size = 30 }: { name: string; color: string; size?: number }) => {
//   return <Ionicons name={name} size={size} color={color} />;
// };



export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#df2020',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
          
            position: 'absolute',
            height:88,elevation: 24,
          },
          android: {

            height: 65,
            elevation: 24,
          },
          default: {
         
            elevation: 6,
            height: 65,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',   
          
          tabBarIcon: ({ color }) => <Icon name="Home" color={color} size={24}/>,
          tabBarLabelStyle: {
            marginTop: 1, // Adds space between icon and title
          },
          tabBarItemStyle: { marginTop: 4 },
        }}
      />
      <Tabs.Screen
        name="past_order"
        options={{
          title: 'Orders',headerShown:true,
          headerLeft:()=>(
            <TouchableOpacity
           
             style={{paddingHorizontal:8}} 
            >
              <ArrowLeft size={24} color="#df2020" />
              
            </TouchableOpacity>
          ),headerTitleAlign: "center", headerTitle: () => (
            <Text style={{fontSize:20,color:"#df2020",fontWeight:700}}>Orders</Text>
          ),
          tabBarIcon: ({ color }) => <Icon name="CalendarArrowUp" color={color} size={24}/>,
          tabBarLabelStyle: {
            marginTop: 1, // Adds space between icon and title
          },
          tabBarItemStyle: { marginTop: 4 },
        }}
      />
     
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',headerShown:true,
          headerLeft:()=>(
            <TouchableOpacity
           
             style={{paddingHorizontal:8}} 
            >
              <ArrowLeft size={24} color="#df2020" />
              
            </TouchableOpacity>
          ), headerTitle: () => (
            <Text style={{fontSize:20,color:"#df2020",fontWeight:700}}>Food  Menu</Text>
          ),headerTitleAlign: "center",
          tabBarIcon: ({ color }) => <Icon name="FileText" color={color} size={24} />,
          tabBarLabelStyle: {
            marginTop: 1, 
          },
          tabBarItemStyle: { marginTop: 4 },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',headerShown:true,
          headerLeft:()=>(
            <TouchableOpacity
           
             style={{paddingHorizontal:8}} 
            >
              <ArrowLeft size={24} color="#df2020" />
              
            </TouchableOpacity>
          ),headerTitleAlign: "center",
          headerTitle: () => (
            <Text style={{fontSize:20,color:"#df2020",fontWeight:700}}>Profile</Text>
          ),
          tabBarIcon: ({ color }) => <Icon name="User" color={color} size={24} />,
          tabBarLabelStyle: {
            marginTop: 1,
          },
          tabBarItemStyle: { marginTop: 4 },
          
        }}
      />
    </Tabs>
  );
}
