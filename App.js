import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import TopicListScreen from './src/screens/TopicListScreen';
import QuizScreen from './src/screens/QuizScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';
import StudyGuideScreen from './src/screens/StudyGuideScreen';
import ExamScreen from './src/screens/ExamScreen';
import ResultsScreen from './src/screens/ResultsScreen';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [quizConfig, setQuizConfig] = useState({ topicNumbers: null, questionCount: 20 });
  const [results, setResults] = useState(null);

  const navigate = useCallback((target, params) => {
    if (params) setQuizConfig(params);
    setScreen(target);
  }, []);

  const handleQuizStart = useCallback((topicNumbers, questionCount) => {
    setQuizConfig({ topicNumbers, questionCount });
    setScreen('quiz');
  }, []);

  const handleQuizFinish = useCallback((score, total, answers, questions) => {
    setResults({ score, total, answers, questions, mode: 'quiz' });
    setScreen('results');
  }, []);

  const handleExamFinish = useCallback((score, total, answers, questions) => {
    setResults({ score, total, answers, questions, mode: 'exam' });
    setScreen('results');
  }, []);

  const handleRetake = useCallback(() => {
    setResults(null);
    if (results?.mode === 'exam') {
      setScreen('exam');
    } else {
      setScreen('quiz');
    }
  }, [results]);

  const handleHome = useCallback(() => {
    setResults(null);
    setScreen('home');
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      {screen === 'home' && (
        <HomeScreen onNavigate={navigate} />
      )}
      {screen === 'topics' && (
        <TopicListScreen onStart={handleQuizStart} />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          key={`quiz-${Date.now()}`}
          topicNumbers={quizConfig.topicNumbers}
          questionCount={quizConfig.questionCount}
          onFinish={handleQuizFinish}
        />
      )}
      {screen === 'flashcards' && (
        <FlashcardScreen
          topicNumbers={null}
          onBack={handleHome}
        />
      )}
      {screen === 'studyGuides' && (
        <StudyGuideScreen onBack={handleHome} />
      )}
      {screen === 'exam' && (
        <ExamScreen
          key={`exam-${Date.now()}`}
          onFinish={handleExamFinish}
          onBack={handleHome}
        />
      )}
      {screen === 'results' && results && (
        <ResultsScreen
          score={results.score}
          total={results.total}
          answers={results.answers}
          questions={results.questions}
          onRetake={handleRetake}
          onHome={handleHome}
        />
      )}
    </>
  );
}
