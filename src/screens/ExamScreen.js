import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import ChoiceButton from '../components/ChoiceButton';
import { shuffleArray, pickRandom } from '../utils/shuffle';
import { logAnswer, logSession } from '../storage/progressStore';
import questionsData from '../data/questions.json';

const TOTAL_QUESTIONS = 110;
const TOTAL_TIME_MINUTES = 150;

export default function ExamScreen({ onFinish, onBack }) {
  const questions = useMemo(() => {
    const national = questionsData.filter(q => q.topicNumber <= 11);
    const state = questionsData.filter(q => q.topicNumber === 12);
    return shuffleArray([
      ...pickRandom(national, 80),
      ...pickRandom(state, 30),
    ]);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_MINUTES * 60);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleFlag = () => {
    const qId = questions[currentIndex].id;
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId); else next.add(qId);
      return next;
    });
  };

  const handleSubmit = () => {
    Alert.alert('Submit Exam?', 'You cannot change answers after submission.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Submit', onPress: () => {
        clearInterval(timerRef.current);
        let correct = 0;
        const answerLog = [];
        questions.forEach(q => {
          const userAns = answers[q.id];
          const isCorrect = userAns === q.correctIndex;
          if (isCorrect) correct++;
          answerLog.push({ questionId: q.id, topicNumber: q.topicNumber, correct: isCorrect });
          if (userAns !== undefined) {
            logAnswer(q.id, q.topicNumber, isCorrect);
          }
        });
        logSession('exam', questions.length, correct);
        setSubmitted(true);
        onFinish(correct, questions.length, answerLog, questions);
      }},
    ]);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (submitted) return null;

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <View style={styles.container}>
      {/* Timer + Stats */}
      <View style={styles.header}>
        <View style={styles.timerBox}>
          <Text style={[styles.timer, timeLeft < 300 && styles.timerWarn]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
        <Text style={styles.headerStat}>{answeredCount}/{TOTAL_QUESTIONS} answered</Text>
        <Text style={styles.headerStat}>{flagged.size} flagged</Text>
      </View>

      {/* Question number grid */}
      <ScrollView horizontal style={styles.gridScroll} showsHorizontalScrollIndicator={false}>
        <View style={styles.grid}>
          {questions.map((q, i) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = i === currentIndex;
            const isFlag = flagged.has(q.id);
            return (
              <TouchableOpacity
                key={q.id}
                style={[
                  styles.gridBtn,
                  isCurrent && styles.gridCurrent,
                  isAnswered && styles.gridAnswered,
                  isFlag && styles.gridFlagged,
                ]}
                onPress={() => setCurrentIndex(i)}
              >
                <Text style={[
                  styles.gridText,
                  isCurrent && styles.gridCurrentText,
                  isAnswered && styles.gridAnsweredText,
                ]}>{i + 1}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Question */}
      <ScrollView style={styles.questionArea} contentContainerStyle={styles.questionContent}>
        <Text style={styles.questionNum}>Question {currentIndex + 1}</Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {currentQuestion.choices.map((choice, index) => (
          <ChoiceButton
            key={index}
            letter={index}
            text={choice}
            onPress={() => handleAnswer(currentQuestion.id, index)}
            disabled={false}
            isCorrect={index === currentQuestion.correctIndex}
            isSelected={answers[currentQuestion.id] === index}
            showResult={false}
          />
        ))}
      </ScrollView>

      {/* Bottom nav */}
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          <Text style={[styles.navBtnText, currentIndex === 0 && styles.navDisabled]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, flagged.has(currentQuestion.id) && styles.flagActive]}
          onPress={handleFlag}
        >
          <Text style={styles.navBtnText}>
            {flagged.has(currentQuestion.id) ? '🚩 Flagged' : '🚩 Flag'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
          disabled={currentIndex === questions.length - 1}
        >
          <Text style={[styles.navBtnText, currentIndex === questions.length - 1 && styles.navDisabled]}>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Exam</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  timerBox: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  timer: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', fontVariant: ['tabular-nums'] },
  timerWarn: { color: '#d32f2f' },
  headerStat: { fontSize: 12, color: '#888' },
  gridScroll: { maxHeight: 60, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  grid: { flexDirection: 'row', paddingHorizontal: 12, gap: 4 },
  gridBtn: {
    width: 36, height: 36, borderRadius: 6, backgroundColor: '#f0f0f0',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0',
  },
  gridCurrent: { borderColor: '#007AFF', borderWidth: 2 },
  gridAnswered: { backgroundColor: '#d4edda' },
  gridFlagged: { borderColor: '#ff9800', borderWidth: 2 },
  gridText: { fontSize: 12, color: '#555' },
  gridCurrentText: { color: '#007AFF', fontWeight: '700' },
  gridAnsweredText: { color: '#155724' },
  questionArea: { flex: 1 },
  questionContent: { padding: 16 },
  questionNum: { fontSize: 13, color: '#888', marginBottom: 8 },
  questionText: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', marginBottom: 20, lineHeight: 26 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  navBtn: { padding: 10 },
  navBtnText: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
  navDisabled: { color: '#ccc' },
  flagActive: { backgroundColor: '#fff3e0', borderRadius: 8 },
  submitBtn: {
    backgroundColor: '#388e3c', margin: 16, padding: 16, borderRadius: 12, alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
