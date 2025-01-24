
export interface FoodItem {
    id: string;
    image: string;
    name: string;
    price: number;
    description?: string;
    offer?: boolean;
    offerPer?: number;
    sides?: string[];
    drinks?: string[];
    ingredients?: string[];
  }
export interface FoodCardProps {
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
    _id: string;
    name: string;
    image: string;
  }