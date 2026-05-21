import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Flashcard from '../components/Flashcard';
import ProgressBar from '../components/ProgressBar';
import { shuffleArray } from '../utils/shuffle';
import { scheduleReview, createSrsState, isDue as checkDue } from '../utils/spacedRepetition';
import { loadSrsState, updateSrsCard } from '../storage/progressStore';
import flashcardsData from '../data/flashcards.json';

export default function FlashcardScreen({ topicNumbers, onBack }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [srsMap, setSrsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    (async () => {
      const srs = await loadSrsState();
      setSrsMap(srs);

      let pool = flashcardsData;
      if (topicNumbers && topicNumbers.length > 0) {
        pool = flashcardsData.filter(fc => topicNumbers.includes(fc.topicNumber));
      }

      // Sort: due cards first, then new, then future
      const due = pool.filter(fc => checkDue(srs[fc.id]));
      const future = pool.filter(fc => !checkDue(srs[fc.id]));

      setCards(shuffleArray(due).concat(shuffleArray(future)));
      setLoading(false);
    })();
  }, [topicNumbers]);

  const handleRate = async (rating) => {
    const card = cards[currentIndex];
    const existing = srsMap[card.id] || createSrsState(card.id);
    const updated = scheduleReview(existing, rating);
    const newMap = { ...srsMap, [card.id]: updated };
    setSrsMap(newMap);
    await updateSrsCard(card.id, updated);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionDone(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading flashcards...</Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No flashcards for selected topics.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}><Text style={styles.backText}>Back</Text></TouchableOpacity>
      </View>
    );
  }

  if (sessionDone) {
    const dueCount = cards.filter(c => checkDue(srsMap[c.id])).length - 1; // minus the one just reviewed
    return (
      <View style={styles.sessionDone}>
        <Text style={styles.doneIcon}>✓</Text>
        <Text style={styles.doneTitle}>Session Complete</Text>
        <Text style={styles.doneSubtitle}>
          {dueCount > 0 ? `${dueCount} card(s) still due.` : 'All due cards reviewed!'}
        </Text>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}><Text style={styles.backText}>Back to Home</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProgressBar current={currentIndex} total={cards.length} />
      <Text style={styles.counter}>Card {currentIndex + 1} of {cards.length}</Text>

      <Flashcard
        front={cards[currentIndex].front}
        back={cards[currentIndex].back}
        onRate={handleRate}
      />

      <TouchableOpacity style={styles.quitBtn} onPress={onBack}>
        <Text style={styles.quitText}>Quit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  counter: { fontSize: 14, color: '#888', marginTop: 12, marginBottom: 20, textAlign: 'center' },
  loadingText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 100, marginBottom: 20 },
  sessionDone: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 24 },
  doneIcon: { fontSize: 48, marginBottom: 16, color: '#388e3c' },
  doneTitle: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  doneSubtitle: { fontSize: 15, color: '#888', marginBottom: 24 },
  backBtn: { backgroundColor: '#007AFF', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 10 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  quitBtn: { alignItems: 'center', marginTop: 20 },
  quitText: { color: '#888', fontSize: 14 },
});
