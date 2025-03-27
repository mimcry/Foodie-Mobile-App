import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal } from 'react-native-paper';

import StarRating from 'react-native-star-rating';

export default function FoodRatingModal({ isVisible, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);

  return (
    <Modal  visible={isVisible} onDismiss={onClose} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>Rate the Food</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={rating}
          selectedStar={(rating) => setRating(rating)}
          fullStarColor="#FFD700"
          starSize={40}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            onSubmit(rating);
            onClose();
          }}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'center', alignItems: 'center' },
  container: { backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  button: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, marginTop: 15 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
