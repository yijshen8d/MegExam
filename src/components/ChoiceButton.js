import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ChoiceButton({ letter, text, onPress, disabled, isCorrect, isSelected, showResult }) {
  let bgColor = '#f0f0f0';
  let textColor = '#333';

  if (showResult) {
    if (isCorrect) {
      bgColor = '#d4edda';
      textColor = '#155724';
    } else if (isSelected) {
      bgColor = '#f8d7da';
      textColor = '#721c24';
    }
  }

  const labels = ['A', 'B', 'C', 'D'];

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.letter, { color: textColor }]}>{labels[letter]}</Text>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      {showResult && isCorrect && <Text style={styles.icon}>✓</Text>}
      {showResult && isSelected && !isCorrect && <Text style={styles.icon}>✗</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginVertical: 6,
  },
  letter: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
    width: 24,
  },
  text: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
  },
});
