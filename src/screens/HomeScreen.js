import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import DayTypeBanner from '../components/DayTypeBanner';
import { getTodaySchedule } from '../utils/scheduler';
import { loadProgress, getWeakAreas } from '../storage/progressStore';

export default function HomeScreen({ onNavigate }) {
  const [schedule] = useState(getTodaySchedule());
  const [stats, setStats] = useState({ streak: 0, totalAnswered: 0, overallPct: null });
  const [weakAreas, setWeakAreas] = useState([]);

  useEffect(() => {
    (async () => {
      const p = await loadProgress();
      const total = p.answers.length;
      const correct = p.answers.filter(a => a.correct).length;
      setStats({
        streak: p.streak,
        totalAnswered: total,
        overallPct: total > 0 ? Math.round((correct / total) * 100) : null,
      });
      setWeakAreas(await getWeakAreas(3));
    })();
  }, []);

  const ModeButton = ({ icon, title, subtitle, screen }) => (
    <TouchableOpacity
      style={styles.modeButton}
      onPress={() => onNavigate(screen)}
      activeOpacity={0.7}
    >
      <Text style={styles.modeIcon}>{icon}</Text>
      <View style={styles.modeText}>
        <Text style={styles.modeTitle}>{title}</Text>
        <Text style={styles.modeSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.modeArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.appTitle}>Meg's Exam Prep</Text>
      <Text style={styles.subtitle}>Maryland PSI 3.0 — Real Estate Salesperson</Text>

      <DayTypeBanner schedule={schedule} />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.totalAnswered}</Text>
          <Text style={styles.statLabel}>Qs Answered</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.overallPct !== null ? `${stats.overallPct}%` : '--'}</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Weak areas */}
      {weakAreas.length > 0 && (
        <View style={styles.weakBox}>
          <Text style={styles.weakTitle}>Focus Areas</Text>
          {weakAreas.map((w, i) => (
            <Text key={i} style={styles.weakItem}>
              Topic {w.topicNumber}: {w.pct}% — practice recommended
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Study Modes</Text>

      <ModeButton
        icon="📝" title="Practice Quiz" subtitle="Topic-based questions with explanations"
        screen="topics"
      />
      <ModeButton
        icon="🃏" title="Flashcards" subtitle="Spaced repetition (SM-2 algorithm)"
        screen="flashcards"
      />
      <ModeButton
        icon="📖" title="Study Guides" subtitle="Read topic summaries & key terms"
        screen="studyGuides"
      />
      <ModeButton
        icon="🏛️" title="Full Exam" subtitle="110 Q timed PSI simulation"
        screen="exam"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  appTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a1a', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 20 },
  statsRow: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  statBox: {
    flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#e0e0e0',
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  weakBox: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#ffcdd2' },
  weakTitle: { fontSize: 14, fontWeight: '700', color: '#c62828', marginBottom: 6 },
  weakItem: { fontSize: 13, color: '#555', marginVertical: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 12, marginTop: 4 },
  modeButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16,
    borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0',
  },
  modeIcon: { fontSize: 28, marginRight: 14 },
  modeText: { flex: 1 },
  modeTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  modeSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  modeArrow: { fontSize: 24, color: '#ccc' },
});
