import AsyncStorage from "@react-native-async-storage/async-storage";
export  const userId =async()=>{
    try{
        const userId =await AsyncStorage.getItem("userId");
        if (!userId){
            console.log("No user found. Please log in again.");
            return null;
        }
        return userId;
    }catch(error){
    console.log("Error fetching user:",error)
    }
}
