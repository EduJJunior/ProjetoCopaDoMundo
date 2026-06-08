import React, { useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { worldCupHistory } from '../data/quizHistory';
import ScreenHeader, { ScreenContainer } from '../components/ui/ScreenHeader';
import ThemeToggle from '../components/ui/ThemeToggle';
import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

export default function HistoryScreen({ navigation }: any) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderItem = ({ item, index }: any) => (
    <Card style={styles.card} accent={index % 2 === 0} onPress={() => navigation.navigate('HistoryDetail', { item })}>
      <View style={styles.cardHeader}>
        <View style={styles.yearBadge}>
          <Text style={styles.year}>{item.year}</Text>
        </View>
        <View style={styles.moreHint}>
          <Text style={styles.moreText}>Ver detalhes</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
        </View>
      </View>
      <Text style={styles.title}>{item.host}</Text>
      <View style={styles.row}>
        <Text style={styles.championLabel}>Campeão</Text>
        <Text style={styles.championValue}>{item.champion}</Text>
      </View>
      <Text style={styles.subtitle}>Vice: {item.runnerUp}</Text>
      <Text style={styles.detail}>Artilheiro: {item.topScorer}</Text>
      <Text style={styles.highlight} numberOfLines={2}>{item.highlight}</Text>
    </Card>
  );

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="Histórico das Copas"
          subtitle="Toque em uma edição para ver todos os detalhes"
          emoji="🏆"
          rightAction={<ThemeToggle />}
        />

        <FlatList
          data={worldCupHistory}
          keyExtractor={(item) => item.year}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ScreenContainer>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1 },
    listContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
    card: { marginBottom: 14 },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    yearBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 8,
    },
    year: {
      fontSize: 16,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.textInverse,
    },
    moreHint: { flexDirection: 'row', alignItems: 'center' },
    moreText: {
      fontSize: 12,
      fontFamily: theme.typography.fontSemiBold,
      color: theme.colors.primary,
      marginRight: 2,
    },
    title: {
      fontSize: 18,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    championLabel: {
      fontSize: 11,
      fontFamily: theme.typography.fontSemiBold,
      color: theme.colors.secondary,
      textTransform: 'uppercase',
      marginRight: 8,
      letterSpacing: 0.5,
    },
    championValue: {
      fontSize: 15,
      fontFamily: theme.typography.fontSemiBold,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    detail: {
      fontSize: 13,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    highlight: {
      fontSize: 13,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      marginTop: 10,
      lineHeight: 20,
      fontStyle: 'italic',
    },
  });
}
