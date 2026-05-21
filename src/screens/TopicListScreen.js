import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import TopicCard from '../components/TopicCard';
import topicsData from '../data/topics.json';
import { getAllTopicAccuracy } from '../storage/progressStore';

export default function TopicListScreen({ onStart }) {
  const [selected, setSelected] = useState(new Set());
  const [accuracy, setAccuracy] = useState({});
  const [questionCount, setQuestionCount] = useState(20);

  useEffect(() => {
    (async () => { setAccuracy(await getAllTopicAccuracy()); })();
  }, []);

  const toggleTopic = (tn) => {
    const next = new Set(selected);
    if (next.has(tn)) next.delete(tn); else next.add(tn);
    setSelected(next);
  };

  const handleStart = () => {
    const topicNums = selected.size > 0 ? [...selected] : topicsData.map(t => t.topicNumber);
    onStart(topicNums, questionCount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Topics</Text>
      <Text style={styles.subtitle}>Tap to select. All selected if none chosen.</Text>

      <FlatList
        data={topicsData}
        keyExtractor={(t) => String(t.topicNumber)}
        renderItem={({ item }) => (
          <TopicCard
            topic={item}
            accuracy={accuracy[item.topicNumber]}
            isSelected={selected.has(item.topicNumber)}
            onPress={() => toggleTopic(item.topicNumber)}
          />
        )}
        style={styles.list}
      />

      <View style={styles.countRow}>
        <Text style={styles.countLabel}>Questions:</Text>
        {[10, 20, 50, 0].map((n) => (
          <TouchableOpacity
            key={n}
            style={[styles.countBtn, questionCount === n && styles.countBtnActive]}
            onPress={() => setQuestionCount(n)}
          >
            <Text style={[styles.countBtnText, questionCount === n && styles.countBtnTextActive]}>
              {n === 0 ? 'All' : n}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
        <Text style={styles.startText}>
          Start Practice ({selected.size > 0 ? `${selected.size} topic(s)` : 'All topics'})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 16, marginTop: 4 },
  list: { flex: 1, marginBottom: 12 },
  countRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  countLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginRight: 4 },
  countBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0',
  },
  countBtnActive: { borderColor: '#007AFF', backgroundColor: '#e8f0fe' },
  countBtnText: { fontSize: 14, color: '#555' },
  countBtnTextActive: { color: '#007AFF', fontWeight: '600' },
  startButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  startText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
