import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const TOPIC_NAMES = {
  1: 'Agency', 2: 'Contracts', 3: 'Financing', 4: 'Property Ownership',
  5: 'Valuation', 6: 'Land Use Controls', 7: 'Transfer of Title',
  8: 'Property Disclosures', 9: 'Property Management',
  10: 'Practice of Real Estate', 11: 'Real Estate Calculations',
  12: 'Maryland State Law',
};

export default function ResultsScreen({ score, total, answers, questions, onRetake, onHome, onReview }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = pct >= 75;

  const topicBreakdown = useMemo(() => {
    const map = {};
    answers.forEach(a => {
      const tn = a.topicNumber;
      if (!map[tn]) map[tn] = { attempted: 0, correct: 0 };
      map[tn].attempted += 1;
      if (a.correct) map[tn].correct += 1;
    });
    return Object.entries(map)
      .map(([tn, d]) => ({
        topicNumber: parseInt(tn),
        name: TOPIC_NAMES[tn] || `Topic ${tn}`,
        ...d,
        pct: Math.round((d.correct / d.attempted) * 100),
      }))
      .sort((a, b) => a.pct - b.pct);
  }, [answers]);

  const weakAreas = topicBreakdown.filter(t => t.pct < 75 && t.attempted >= 3).slice(0, 3);

  const wrongAnswers = answers.filter(a => !a.correct);
  const wrongWithQuestions = wrongAnswers.map(a => {
    const q = questions.find(q => q.id === a.questionId);
    return { ...a, question: q };
  }).filter(a => a.question);

  const quartileAnalysis = useMemo(() => {
    const total = answers.length;
    if (total < 4) return null;
    const qs = [0, 0, 0, 0];
    const totals = [0, 0, 0, 0];
    answers.forEach((a, i) => {
      const qi = Math.min(3, Math.floor((i / total) * 4));
      totals[qi] += 1;
      if (a.correct) qs[qi] += 1;
    });
    return [
      { label: 'Q1 (Start)', pct: Math.round((qs[0] / totals[0]) * 100) },
      { label: 'Q2', pct: Math.round((qs[1] / totals[1]) * 100) },
      { label: 'Q3', pct: Math.round((qs[2] / totals[2]) * 100) },
      { label: 'Q4 (End)', pct: Math.round((qs[3] / totals[3]) * 100) },
    ];
  }, [answers]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Score */}
      <View style={[styles.resultBanner, passed ? styles.passed : styles.failed]}>
        <Text style={styles.resultIcon}>{passed ? '✓' : '✗'}</Text>
        <Text style={styles.resultText}>{passed ? 'PASSED' : 'Not Yet'}</Text>
        <Text style={styles.resultSubtext}>
          {passed ? 'Great work!' : 'PSI passing score is 75%. Keep studying.'}
        </Text>
      </View>

      <Text style={styles.score}>{score} / {total}</Text>
      <Text style={styles.percentage}>{pct}%</Text>

      {/* Quartile fatigue analysis */}
      {quartileAnalysis && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fatigue Analysis</Text>
          <View style={styles.quartileRow}>
            {quartileAnalysis.map((q, i) => (
              <View key={i} style={styles.quartileBox}>
                <Text style={styles.quartileLabel}>{q.label}</Text>
                <Text style={[styles.quartilePct, q.pct < 70 && { color: '#d32f2f' }]}>{q.pct}%</Text>
              </View>
            ))}
          </View>
          {quartileAnalysis[3].pct < quartileAnalysis[0].pct - 15 && (
            <Text style={styles.fatigueNote}>
              Accuracy dropped in Q4 — consider shorter sessions or more breaks.
            </Text>
          )}
        </View>
      )}

      {/* Topic breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Topic</Text>
        {topicBreakdown.map((t, i) => (
          <View key={i} style={styles.topicRow}>
            <Text style={styles.topicName}>{t.name}</Text>
            <View style={styles.topicBarTrack}>
              <View style={[styles.topicBarFill, { width: `${t.pct}%` }, t.pct < 75 ? { backgroundColor: '#f57c00' } : { backgroundColor: '#388e3c' }]} />
            </View>
            <Text style={styles.topicPct}>{t.pct}%</Text>
          </View>
        ))}
      </View>

      {/* Weak areas */}
      {weakAreas.length > 0 && (
        <View style={styles.weakBox}>
          <Text style={styles.weakTitle}>Focus on These</Text>
          {weakAreas.map((w, i) => (
            <Text key={i} style={styles.weakItem}>{w.name}: {w.pct}% ({w.correct}/{w.attempted})</Text>
          ))}
        </View>
      )}

      {/* Wrong answers review */}
      {wrongWithQuestions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wrong Answers ({wrongWithQuestions.length})</Text>
          {wrongWithQuestions.slice(0, 10).map((a, i) => (
            <View key={i} style={styles.wrongItem}>
              <Text style={styles.wrongQ}>{a.question?.question}</Text>
              <Text style={styles.wrongYour}>Your answer: {a.question?.choices[a.userAnswer] ?? '—'}</Text>
              <Text style={styles.wrongCorrect}>Correct: {a.question?.choices[a.question?.correctIndex]}</Text>
            </View>
          ))}
          {wrongWithQuestions.length > 10 && (
            <Text style={styles.moreText}>+{wrongWithQuestions.length - 10} more wrong answers</Text>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.retakeBtn} onPress={onRetake}>
          <Text style={styles.retakeText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={onHome}>
          <Text style={styles.homeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  resultBanner: { padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  passed: { backgroundColor: '#d4edda' },
  failed: { backgroundColor: '#f8d7da' },
  resultIcon: { fontSize: 40 },
  resultText: { fontSize: 24, fontWeight: '800', color: '#1a1a1a', marginTop: 6 },
  resultSubtext: { fontSize: 13, color: '#555', marginTop: 4 },
  score: { fontSize: 48, fontWeight: '800', textAlign: 'center', color: '#007AFF' },
  percentage: { fontSize: 22, textAlign: 'center', color: '#888', marginBottom: 24 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  quartileRow: { flexDirection: 'row', gap: 8 },
  quartileBox: { flex: 1, alignItems: 'center', backgroundColor: '#f8f8f8', padding: 10, borderRadius: 8 },
  quartileLabel: { fontSize: 10, color: '#888', fontWeight: '600' },
  quartilePct: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginTop: 4 },
  fatigueNote: { fontSize: 12, color: '#d32f2f', marginTop: 10, fontStyle: 'italic' },
  topicRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  topicName: { width: 130, fontSize: 12, color: '#555' },
  topicBarTrack: { flex: 1, height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginRight: 8 },
  topicBarFill: { height: '100%', borderRadius: 4 },
  topicPct: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', width: 38, textAlign: 'right' },
  weakBox: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#f57c00' },
  weakTitle: { fontSize: 14, fontWeight: '700', color: '#e65100', marginBottom: 4 },
  weakItem: { fontSize: 13, color: '#555', marginVertical: 1 },
  wrongItem: { backgroundColor: '#fff3e0', padding: 10, borderRadius: 8, marginBottom: 8 },
  wrongQ: { fontSize: 13, fontWeight: '600', color: '#333' },
  wrongYour: { fontSize: 12, color: '#d32f2f', marginTop: 4 },
  wrongCorrect: { fontSize: 12, color: '#388e3c' },
  moreText: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  retakeBtn: { flex: 1, backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  retakeText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  homeBtn: { flex: 1, backgroundColor: '#e0e0e0', padding: 16, borderRadius: 12, alignItems: 'center' },
  homeText: { color: '#555', fontSize: 17, fontWeight: '600' },
});
