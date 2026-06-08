import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WorldCupHistoryItem } from '../data/quizHistory';
import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

export default function HistoryDetailScreen({ route }: any) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { item } = route.params;

  const details = [
    { label: 'País-sede', value: item.host, icon: '🌍' },
    { label: 'Campeão', value: item.champion, icon: '🏆' },
    { label: 'Vice-campeão', value: item.runnerUp, icon: '🥈' },
    { label: 'Artilheiro', value: item.topScorer, icon: '⚽' },
    { label: 'Placar da final', value: item.finalScore, icon: '📋' },
    { label: 'Estádio da final', value: item.stadium, icon: '🏟️' },
    { label: 'Seleções participantes', value: item.teams, icon: '🏳️' },
    { label: 'Mascote', value: item.mascot, icon: '🎭' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        style={styles.hero}
      >
        <Text style={styles.heroYear}>Copa {item.year}</Text>
        <Text style={styles.heroHost}>{item.host}</Text>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Campeão: {item.champion}</Text>
        </View>
      </LinearGradient>

      <Card style={styles.highlightCard} accent>
        <Text style={styles.sectionTitle}>Destaque</Text>
        <Text style={styles.highlightText}>{item.highlight}</Text>
      </Card>

      <Text style={styles.sectionHeading}>Informações completas</Text>
      {details.map((detail) => (
        <Card key={detail.label} style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>{detail.icon}</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{detail.label}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          </View>
        </Card>
      ))}

      <Card style={styles.funCard}>
        <Text style={styles.sectionTitle}>Curiosidade extra</Text>
        <Text style={styles.funText}>{item.funFact}</Text>
      </Card>
    </ScrollView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { paddingBottom: 32 },
    hero: {
      padding: 28,
      paddingTop: 20,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      alignItems: 'center',
    },
    heroYear: {
      fontSize: 42,
      fontFamily: theme.typography.fontBold,
      color: '#FFFFFF',
    },
    heroHost: {
      fontSize: 20,
      fontFamily: theme.typography.fontMedium,
      color: 'rgba(255,255,255,0.9)',
      marginTop: 4,
    },
    heroBadge: {
      marginTop: 16,
      backgroundColor: 'rgba(245, 200, 66, 0.25)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(245, 200, 66, 0.5)',
    },
    heroBadgeText: {
      color: theme.colors.secondary,
      fontFamily: theme.typography.fontSemiBold,
      fontSize: 14,
    },
    highlightCard: { margin: 16, marginBottom: 8 },
    sectionTitle: {
      fontSize: 16,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
      marginBottom: 8,
    },
    highlightText: {
      fontSize: 15,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
    sectionHeading: {
      fontSize: 13,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 12,
    },
    detailCard: { marginHorizontal: 16, marginBottom: 10, padding: 14 },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start' },
    detailIcon: { fontSize: 22, marginRight: 14, marginTop: 2 },
    detailContent: { flex: 1 },
    detailLabel: {
      fontSize: 11,
      fontFamily: theme.typography.fontSemiBold,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    detailValue: {
      fontSize: 15,
      fontFamily: theme.typography.fontSemiBold,
      color: theme.colors.text,
      marginTop: 4,
      lineHeight: 22,
    },
    funCard: { marginHorizontal: 16, marginTop: 8 },
    funText: {
      fontSize: 14,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      fontStyle: 'italic',
    },
  });
}
