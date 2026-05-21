import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressBar({ current, total }) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
});
