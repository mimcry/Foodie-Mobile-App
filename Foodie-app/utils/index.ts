
export interface FoodItem {
    food_id: string;
    image: string;
    food_name: string;
    price: number;
    description?: string;
    offer?: number;
   tags:string;
    sides?: string[];
    drinks?: string[];
    ingredients?: string[];
  }
export interface FoodCardProps {
    image: string;
   food_name: string;
    price: number;
    description?: string;
    food_id: string;
  tags:string;
    offer?: number;
    sides?: string[];
    drinks?: string[];
    ingredients?: string[];
    item: FoodItem; 
    sidesprice?:string[];
    drinkprice?:string[];
    onPress?: () => void;
  }
  export interface OfferFoodProps{
    image: string;
    name: string;
    price: number;
    description?: string;
    id: string;
    offer?: boolean;
    offerPer?: number;
    sides?: string[];
    drinks?: string[];
    ingredients?: string[];
    sidesprice?:string[];
    drinkprice?:string[];
    item: FoodItem; 
    onPress?:()=>void;
  }
 
  
  export interface Tag {
    id: number;
    name: string;
    image: string;
  }