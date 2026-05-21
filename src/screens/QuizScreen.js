import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import ChoiceButton from '../components/ChoiceButton';
import ProgressBar from '../components/ProgressBar';
import { shuffleArray, pickRandom } from '../utils/shuffle';
import { logAnswer } from '../storage/progressStore';
import questionsData from '../data/questions.json';

export default function QuizScreen({ topicNumbers, questionCount, onFinish }) {
  const questions = useMemo(() => {
    let pool = questionsData;
    if (topicNumbers && topicNumbers.length > 0) {
      pool = questionsData.filter(q => topicNumbers.includes(q.topicNumber));
    }
    const selected = questionCount > 0 ? pickRandom(pool, questionCount) : shuffleArray(pool);
    return selected;
  }, [topicNumbers, questionCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const correct = index === currentQuestion.correctIndex;
    if (correct) setScore(score + 1);
    setAnswers([...answers, { questionId: currentQuestion.id, topicNumber: currentQuestion.topicNumber, correct, userAnswer: index }]);
    logAnswer(currentQuestion.id, currentQuestion.topicNumber, correct);
  };

  const handleNext = () => {
    if (isLast) {
      onFinish(score, questions.length, answers, questions);
    } else {
      setSelectedAnswer(null);
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No questions found for selected topics.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProgressBar current={currentIndex} total={questions.length} />

      <Text style={styles.counter}>
        Question {currentIndex + 1} of {questions.length}
      </Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {currentQuestion.choices.map((choice, index) => (
          <ChoiceButton
            key={index}
            letter={index}
            text={choice}
            onPress={() => handleSelect(index)}
            disabled={selectedAnswer !== null}
            isCorrect={index === currentQuestion.correctIndex}
            isSelected={index === selectedAnswer}
            showResult={selectedAnswer !== null}
          />
        ))}

        {selectedAnswer !== null && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {selectedAnswer !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.nextText}>{isLast ? 'See Results' : 'Next'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  counter: { fontSize: 14, color: '#888', marginTop: 12, marginBottom: 8 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  questionText: { fontSize: 20, fontWeight: '600', color: '#1a1a1a', marginBottom: 24, marginTop: 12, lineHeight: 28 },
  explanationBox: { backgroundColor: '#e8f0fe', padding: 16, borderRadius: 10, marginTop: 16 },
  explanationText: { fontSize: 14, color: '#1a3a5c', lineHeight: 22 },
  nextButton: { backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  nextText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 100 },
});
