import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TopicCard({ topic, accuracy, isSelected, onPress }) {
  const weightColor = topic.examWeightPct >= 12 ? '#d32f2f' :
                      topic.examWeightPct >= 8  ? '#f57c00' : '#388e3c';

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Text style={styles.number}>{topic.topicNumber}</Text>
      </View>
      <View style={styles.center}>
        <Text style={styles.name}>{topic.name}</Text>
        {accuracy && (
          <Text style={styles.accuracy}>
            {accuracy.pct}% correct ({accuracy.attempted} Qs)
          </Text>
        )}
      </View>
      <View style={styles.right}>
        <Text style={[styles.weight, { color: weightColor }]}>{topic.examWeightPct}%</Text>
        <Text style={styles.weightLabel}>of exam</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selected: {
    borderColor: '#007AFF',
    backgroundColor: '#e8f0fe',
  },
  left: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  number: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
  },
  center: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  accuracy: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  weight: {
    fontSize: 18,
    fontWeight: '700',
  },
  weightLabel: {
    fontSize: 11,
    color: '#888',
  },
});
