import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import { worldCupHistory } from '../data/quizHistory';
import { theme } from '../styles/theme';

export default function HistoryScreen() {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.year}>{item.year}</Text>
      <Text style={styles.title}>{item.host}</Text>
      <Text style={styles.subtitle}>Campeão: {item.champion}</Text>
      <Text style={styles.subtitle}>Vice: {item.runnerUp}</Text>
      <Text style={styles.detail}>Artilheiro: {item.topScorer}</Text>
      <Text style={styles.detail}>{item.highlight}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico das Copas</Text>
        <Text style={styles.headerSubtitle}>Linha do tempo de episódios, campeões e curiosidades.</Text>
      </View>

      <FlatList
        data={worldCupHistory}
        keyExtractor={(item) => item.year}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 20, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderColor: theme.colors.border },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: theme.colors.primary },
  headerSubtitle: { fontSize: 14, color: theme.colors.textLight, marginTop: 4 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border },
  year: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.textLight, marginTop: 6 },
  detail: { fontSize: 13, color: theme.colors.textLight, marginTop: 4, lineHeight: 20 }
});
