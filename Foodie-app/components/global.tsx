import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import { useCart } from "react-use-cart";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FoodCardProps } from "@/utils";
export const ipAddress = "http://192.168.1.67:9002";

interface GlobalConfig {
  fontSize: {
    large: number;
    medium: number;
    small: number;
  };
  color: {
    global: string;
    backgroundcolor: string;
    gray: string;
  };
}

const Global: GlobalConfig = {
  fontSize: {
    large: 26,
    medium: 20,
    small: 18,
  },
  color: {
    global: "#df2020",
    backgroundcolor: "#FFE4E4",
    gray: "gray",
  },
};

interface GlobalButtonProps {
  onPress: () => void;
  name: string;
}

export const GlobalButton: React.FC<GlobalButtonProps> = ({
  onPress,
  name,
}) => {
  return (
    <View>
      <Button
        onPress={onPress}
        mode="contained"
        style={{
          padding: 10,
          backgroundColor: Global.color.global,
          marginTop: "10%",
          marginBottom: 200,
        }}
        labelStyle={{ fontSize: Global.fontSize.medium }}
      >
        {name}
      </Button>
    </View>
  );
};

interface FoodTitleProps {
  Topic: string;
  Title: string;
}

export const FoodTitle: React.FC<FoodTitleProps> = ({ Topic, Title }) => {
  return (
    <View>
      <Text
        style={{
          fontSize: Global.fontSize.large,
          fontWeight: "bold",
          marginTop: "5%",
        }}
      >
        {Topic}
        <Text style={{ color: "#df2020" }}> {Title}</Text>
      </Text>
    </View>
  );
};

export const FoodCard: React.FC<FoodCardProps> = (props) => {
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();

  const onPressItem = () => {
    navigation.navigate("fooddescription", {
      item: props,
      id: props.food_id,

      offer: props.offer,
    });
  };

  return (
    <View>
      <View
        style={{
          maxWidth: 120,
          borderRadius: 25,
          borderWidth: 2,
          padding: 6,
          borderColor: "white",
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={onPressItem}>
          <View
            style={{
              backgroundColor: "#f7e5e4",
              borderRadius: 25,
              width: 100,
              height: 90,
              position: "relative",
            }}
          >
            <Image
              source={{ uri: `http://192.168.1.67:8000${props.image}` }}
              style={{
                width: 95,
                height: 85,
                position: "absolute",
                borderRadius: 25,
              }}
            />
            {props.offer == 0 ? null : (
              <View
                style={{
                  position: "absolute",
                  borderTopLeftRadius: 25,
                  backgroundColor: "red",
                  paddingVertical: 2,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "white" }}> {props.offer}% Off</Text>
              </View>
            )}
            <TouchableOpacity activeOpacity={0.5} onPress={onPressItem}>
              <Icon
                name="plus"
                size={15}
                color="black"
                style={{
                  position: "absolute",
                  zIndex: 2,
                  marginTop: 50,
                  right: 0,
                  borderWidth: 1,
                  borderRadius: 25,
                  borderColor: "white",
                  backgroundColor: "white",
                  alignSelf: "center",
                  elevation: 5,
                  padding: 4,
                }}
              />
            </TouchableOpacity>
          </View>
          <Text>{props.food_name}</Text>
          {props.offer ==0 ? (
                <Text style={{ color: "green" }}>Rs. {props.price}</Text>
          ) : (
       
            <View style={{ flexDirection: "row" }}>
            <Text style={{ textDecorationLine: "line-through" }}>
              Rs.{props.price}
            </Text>
            <Text style={{ color: "green", marginLeft: "auto" }}>
              Rs.{props.price - (props.price * props.offer) / 100}
            </Text>
          </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface AlertProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Warning</Text>
          <Text style={styles.modalMessage}>
            You have an allergy to garlic. Are you sure you want to add this
            item?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={{ flex: 1, marginHorizontal: 5 }}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, marginHorizontal: 5 }}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  confirmText: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
  },
});

export default Global;
