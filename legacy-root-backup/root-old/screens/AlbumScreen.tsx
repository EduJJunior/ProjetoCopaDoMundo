import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { albumData, CardItem } from '../data/mockData';
import { theme } from '../styles/theme';

type AlbumCard = CardItem & {
  type: 'team' | 'player' | 'stadium' | 'mascot';
  title: string;
  subtitle: string;
  image: any;
  description: string;
  stats: string;
  curiosity: string;
};

const getItemType = (item: CardItem) => {
  if (item.type) return item.type;
  if (item.posicao === 'Estádio') return 'stadium';
  if (item.posicao === 'Seleção') return 'team';
  if (item.posicao === 'Mascote') return 'mascot';
  return 'player';
};

export default function AlbumScreen({ navigation }: any) {
  const [filter, setFilter] = useState<'all' | 'team' | 'player' | 'stadium' | 'mascot'>('all');

  const normalizedData: AlbumCard[] = albumData.map((item) => ({
    ...item,
    type: getItemType(item),
    title: item.nome,
    subtitle: `${item.selecao} • ${item.posicao}`,
    image: item.imagem,
    description: item.description ?? `Figurinha da seleção ${item.selecao}. ${item.curiosidade}`,
    stats: item.stats ?? item.posicao,
    curiosity: item.curiosidade
  }));

  const filteredData = filter === 'all' ? normalizedData : normalizedData.filter((item) => item.type === filter);

  const renderCard = ({ item }: { item: AlbumCard }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Details', { item })}
      accessibilityRole="button"
    >
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTag}>{item.type?.toUpperCase() ?? 'FIGURINHA'}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Álbum Digital</Text>
        <Text style={styles.headerSubtitle}>Explore seleções, craques e estádios da Copa</Text>
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'team', 'player', 'stadium', 'mascot'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filter === type && styles.filterButtonActive]}
            onPress={() => setFilter(type)}
          >
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
              {type === 'all' ? 'Todos' : type === 'team' ? 'Seleções' : type === 'player' ? 'Craques' : type === 'stadium' ? 'Estádios' : 'Mascotes'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList<AlbumCard>
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum item encontrado para este filtro.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 20, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderColor: theme.colors.border },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: theme.colors.primary },
  headerSubtitle: { fontSize: 14, color: theme.colors.textLight, marginTop: 4 },
  filterContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginVertical: 12, justifyContent: 'space-between', gap: 8 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 8 },
  filterButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterText: { fontSize: 12, color: theme.colors.textLight, fontWeight: '600' },
  filterTextActive: { color: theme.colors.surface },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  cardContent: { padding: 16 },
  cardTag: { fontSize: 10, fontWeight: 'bold', color: theme.colors.secondary, marginBottom: 4, letterSpacing: 1 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
  cardSubtitle: { fontSize: 14, color: theme.colors.textLight, marginTop: 2 },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: theme.colors.textLight, fontSize: 14 }
});