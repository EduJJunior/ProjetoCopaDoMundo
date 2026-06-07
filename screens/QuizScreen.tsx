import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { quizData } from '../data/mockData';
import { theme } from '../styles/theme';

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === quizData[currentQuestion].correct) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Arena Quiz 🏆</Text>
        <Text style={styles.headerSubtitle}>Mostre que você sabe tudo de Copa do Mundo!</Text>
      </View>

      {!quizFinished ? (
        <View style={styles.card}>
          <Text style={styles.progress}>Pergunta {currentQuestion + 1} de {quizData.length}</Text>
          <Text style={styles.questionText}>{quizData[currentQuestion].question}</Text>
          
          {quizData[currentQuestion].options.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionButton} 
              onPress={() => handleAnswer(index)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Fim de Jogo!</Text>
          <Text style={styles.scoreText}>Você acertou {score} de {quizData.length} perguntas.</Text>
          <TouchableOpacity style={styles.resetButton} onPress={restartQuiz}>
            <Text style={styles.resetButtonText}>Jogar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: theme.colors.primary },
  headerSubtitle: { fontSize: 14, color: theme.colors.textLight, marginTop: 4 },
  card: { backgroundColor: theme.colors.surface, margin: 20, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border },
  progress: { fontSize: 12, color: theme.colors.secondary, fontWeight: 'bold', marginBottom: 8 },
  questionText: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 20 },
  optionButton: { backgroundColor: theme.colors.background, padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  optionText: { fontSize: 15, color: theme.colors.text, fontWeight: '500' },
  scoreCard: { backgroundColor: theme.colors.surface, margin: 20, padding: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  scoreTitle: { fontSize: 24, fontWeight: 'bold', color: theme.colors.success, marginBottom: 10 },
  scoreText: { fontSize: 16, color: theme.colors.text, marginBottom: 24, textAlign: 'center' },
  resetButton: { backgroundColor: theme.colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  resetButtonText: { color: '#FFF', fontWeight: 'bold' }
});