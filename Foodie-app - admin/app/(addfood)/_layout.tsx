
import { Redirect, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import Icon from '@/constants/icons';
export default function Layout() {

  return (
    <Stack>
     
      <Stack.Screen name="addfood" options={{
          title: 'Add Food',headerShown:true,
          headerLeft:()=>(
            <TouchableOpacity
           
             style={{paddingHorizontal:8}} 
            >
              <ArrowLeft size={24} color="#df2020" />
              
            </TouchableOpacity>
          ),headerTitleAlign: "center",
          headerTitle: () => (
            <Text style={{fontSize:20,color:"#df2020",fontWeight:700}}>Add Food</Text>
          ),
         
        
          
        }}/>
      
    </Stack>
  );
}

