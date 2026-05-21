import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DayTypeBanner({ schedule }) {
  if (!schedule) return null;

  const isGreen = schedule.type === 'green';
  const bgColor = isGreen ? '#d4edda' : '#fff3cd';
  const textColor = isGreen ? '#155724' : '#856404';
  const icon = isGreen ? '☀️' : '🌙';

  return (
    <View style={[styles.banner, { backgroundColor: bgColor }]}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textBlock}>
        <Text style={[styles.label, { color: textColor }]}>{schedule.label}</Text>
        <Text style={[styles.sublabel, { color: textColor }]}>{schedule.sublabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  sublabel: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.8,
  },
});
