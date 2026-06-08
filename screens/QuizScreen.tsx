import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { quizPacks, QuizPack } from '../data/quizHistory';
import ScreenHeader, { ScreenContainer } from '../components/ui/ScreenHeader';
import ThemeToggle from '../components/ui/ThemeToggle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';
import { loadQuizScores, saveQuizScore, QuizScoresMap } from '../utils/quizScores';

type Phase = 'select' | 'playing' | 'finished';

export default function QuizScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [phase, setPhase] = useState<Phase>('select');
  const [selectedQuiz, setSelectedQuiz] = useState<QuizPack | null>(null);
  const [scores, setScores] = useState<QuizScoresMap>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const refreshScores = useCallback(async () => {
    const loaded = await loadQuizScores();
    setScores(loaded);
  }, []);

  useEffect(() => {
    refreshScores();
  }, [refreshScores]);

  const questions = selectedQuiz?.questions ?? [];
  const progress = questions.length ? ((currentQuestion + (phase === 'finished' ? 1 : 0)) / questions.length) * 100 : 0;

  const startQuiz = (quiz: QuizPack) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIsNewRecord(false);
    setPhase('playing');
  };

  const handleAnswer = (selectedIndex: number) => {
    if (!selectedQuiz) return;
    setSelectedOption(selectedIndex);
    const isCorrect = selectedIndex === questions[currentQuestion].correct;

    setTimeout(async () => {
      const newScore = isCorrect ? score + 1 : score;
      if (isCorrect) setScore(newScore);

      const nextQuestion = currentQuestion + 1;
      setSelectedOption(null);

      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        const result = await saveQuizScore(selectedQuiz.id, newScore, questions.length);
        setIsNewRecord(result.isNewRecord);
        setScores((prev) => ({ ...prev, [selectedQuiz.id]: result.record }));
        setPhase('finished');
      }
    }, 450);
  };

  const restartQuiz = () => {
    if (!selectedQuiz) return;
    startQuiz(selectedQuiz);
  };

  const backToMenu = () => {
    setPhase('select');
    setSelectedQuiz(null);
    refreshScores();
  };

  const scorePercent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const bestScore = selectedQuiz ? scores[selectedQuiz.id]?.best ?? 0 : 0;

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="Arena Quiz"
          subtitle={
            phase === 'select'
              ? 'Escolha um quiz e bata seu recorde!'
              : selectedQuiz?.title ?? 'Quiz da Copa'
          }
          emoji="🏆"
          rightAction={<ThemeToggle />}
        />

        {phase === 'select' ? (
          <ScrollView contentContainerStyle={styles.selectBody} showsVerticalScrollIndicator={false}>
            {quizPacks.map((quiz) => {
              const record = scores[quiz.id];
              return (
                <Card key={quiz.id} style={styles.quizCard}>
                  <View style={styles.quizHeader}>
                    <Text style={styles.quizEmoji}>{quiz.emoji}</Text>
                    <View style={styles.quizInfo}>
                      <Text style={styles.quizTitle}>{quiz.title}</Text>
                      <Text style={styles.quizDesc}>{quiz.description}</Text>
                      <Text style={styles.quizMeta}>
                        {quiz.questions.length} perguntas
                        {record ? ` • Recorde: ${record.best}/${quiz.questions.length}` : ''}
                      </Text>
                    </View>
                  </View>
                  <Button
                    label={record ? 'Jogar novamente' : 'Começar'}
                    icon="play"
                    variant="primary"
                    onPress={() => startQuiz(quiz)}
                    fullWidth
                  />
                </Card>
              );
            })}
          </ScrollView>
        ) : null}

        {phase === 'playing' && selectedQuiz ? (
          <View style={styles.body}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>

            <Card style={styles.card}>
              <Text style={styles.progress}>
                Pergunta {currentQuestion + 1} de {questions.length}
              </Text>
              <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>

              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === questions[currentQuestion].correct;
                const showResult = selectedOption !== null;

                let optionStyle = styles.optionButton;
                if (showResult && isSelected && isCorrect) optionStyle = styles.optionCorrect;
                else if (showResult && isSelected && !isCorrect) optionStyle = styles.optionWrong;
                else if (showResult && isCorrect) optionStyle = styles.optionCorrect;

                return (
                  <TouchableOpacity
                    key={index}
                    style={optionStyle}
                    onPress={() => selectedOption === null && handleAnswer(index)}
                    disabled={selectedOption !== null}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionIndex}>
                      <Text style={styles.optionIndexText}>{String.fromCharCode(65 + index)}</Text>
                    </View>
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </Card>

            <Button label="Voltar ao menu" icon="arrow-back" variant="ghost" onPress={backToMenu} fullWidth />
          </View>
        ) : null}

        {phase === 'finished' && selectedQuiz ? (
          <View style={styles.body}>
            <LinearGradient
              colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
              style={styles.scoreGradient}
            >
              {isNewRecord ? (
                <View style={styles.recordBadge}>
                  <Text style={styles.recordBadgeText}>🏅 NOVO RECORDE!</Text>
                </View>
              ) : null}
              <Text style={styles.scoreEmoji}>{scorePercent >= 70 ? '🥇' : scorePercent >= 40 ? '⚽' : '📖'}</Text>
              <Text style={styles.scoreTitle}>Fim de Jogo!</Text>
              <Text style={styles.scoreText}>
                Você acertou {score} de {questions.length} perguntas
              </Text>
              <Text style={styles.scorePercent}>{scorePercent}%</Text>
              <Text style={styles.bestScore}>
                Recorde: {bestScore}/{questions.length}
              </Text>
            </LinearGradient>

            <Button
              label="Tentar novamente"
              icon="refresh"
              variant="gold"
              onPress={restartQuiz}
              fullWidth
              style={styles.actionBtn}
            />
            <Button label="Escolher outro quiz" icon="grid" variant="outline" onPress={backToMenu} fullWidth />
          </View>
        ) : null}
      </SafeAreaView>
    </ScreenContainer>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1 },
    selectBody: { padding: 16, paddingBottom: 24, gap: 14 },
    quizCard: { marginBottom: 4 },
    quizHeader: { flexDirection: 'row', marginBottom: 14 },
    quizEmoji: { fontSize: 36, marginRight: 14 },
    quizInfo: { flex: 1 },
    quizTitle: {
      fontSize: 17,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
    },
    quizDesc: {
      fontSize: 13,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      marginTop: 4,
      lineHeight: 19,
    },
    quizMeta: {
      fontSize: 12,
      fontFamily: theme.typography.fontSemiBold,
      color: theme.colors.secondary,
      marginTop: 6,
    },
    body: { flex: 1, padding: 16 },
    progressBar: {
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 16,
    },
    progressFill: { height: '100%', borderRadius: 3 },
    card: { flex: 1, marginBottom: 12 },
    progress: {
      fontSize: 12,
      color: theme.colors.secondary,
      fontFamily: theme.typography.fontBold,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    questionText: {
      fontSize: 19,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
      marginBottom: 24,
      lineHeight: 28,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundAlt,
      padding: 16,
      borderRadius: 14,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
    },
    optionCorrect: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.mode === 'dark' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(27, 138, 75, 0.12)',
      padding: 16,
      borderRadius: 14,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.success,
    },
    optionWrong: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.mode === 'dark' ? 'rgba(248, 113, 113, 0.15)' : 'rgba(198, 40, 40, 0.1)',
      padding: 16,
      borderRadius: 14,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.error,
    },
    optionIndex: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    optionIndexText: {
      color: theme.colors.textInverse,
      fontFamily: theme.typography.fontBold,
      fontSize: 14,
    },
    optionText: {
      flex: 1,
      fontSize: 15,
      fontFamily: theme.typography.fontMedium,
      color: theme.colors.text,
    },
    scoreGradient: {
      borderRadius: 24,
      padding: 36,
      alignItems: 'center',
      marginBottom: 20,
      ...theme.shadows.md,
    },
    recordBadge: {
      backgroundColor: 'rgba(245, 200, 66, 0.3)',
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 12,
    },
    recordBadgeText: {
      color: theme.colors.secondary,
      fontFamily: theme.typography.fontBold,
      fontSize: 13,
    },
    scoreEmoji: { fontSize: 48, marginBottom: 12 },
    scoreTitle: {
      fontSize: 28,
      fontFamily: theme.typography.fontBold,
      color: '#FFFFFF',
      marginBottom: 8,
    },
    scoreText: {
      fontSize: 16,
      fontFamily: theme.typography.fontRegular,
      color: 'rgba(255,255,255,0.85)',
      textAlign: 'center',
    },
    scorePercent: {
      fontSize: 42,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.secondary,
      marginTop: 12,
    },
    bestScore: {
      fontSize: 14,
      fontFamily: theme.typography.fontSemiBold,
      color: 'rgba(255,255,255,0.75)',
      marginTop: 8,
    },
    actionBtn: { marginBottom: 12 },
  });
}
