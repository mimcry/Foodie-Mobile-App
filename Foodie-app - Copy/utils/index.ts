
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
    averageRating?:string
    reviewsCount?:string;
    duration?:string;
    calories?:string
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
    averageRating?:string
    reviewsCount?:string;
    duration?:string;
    calories?:string
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
    averageRating?:string
    reviewsCount?:string;
    duration?:string;
    calories?:string
  }
 
  
  export interface Tag {
    id: number;
    name: string;
    image: string;
  }
  export type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    restaurant: string;
  };
  export type Order = {
    id: string;
    orderNumber: string;
    date: string;
    time: string;
    status: string;
    total: number;
    items: OrderItem[];
  };
    