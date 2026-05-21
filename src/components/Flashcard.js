import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Flashcard({ front, back, onRate }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (!flipped) setFlipped(true);
  };

  const handleRate = (rating) => {
    setFlipped(false);
    onRate(rating);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, flipped && styles.cardFlipped]}
        onPress={handleFlip}
        activeOpacity={0.95}
      >
        <Text style={styles.cardText}>{flipped ? back : front}</Text>
        <Text style={styles.hint}>{flipped ? '' : 'Tap to reveal answer'}</Text>
      </TouchableOpacity>

      {flipped && (
        <View style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>How well did you know this?</Text>
          <View style={styles.buttons}>
            {[
              { rating: 1, label: 'Again', color: '#d32f2f' },
              { rating: 2, label: 'Hard', color: '#f57c00' },
              { rating: 3, label: 'Good', color: '#388e3c' },
              { rating: 4, label: 'Easy', color: '#1976d2' },
            ].map((r) => (
              <TouchableOpacity
                key={r.rating}
                style={[styles.rateBtn, { backgroundColor: r.color }]}
                onPress={() => handleRate(r.rating)}
              >
                <Text style={styles.rateText}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    minHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardFlipped: {
    backgroundColor: '#f8f9fa',
  },
  cardText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  hint: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 16,
  },
  ratingRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  rateBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rateText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
