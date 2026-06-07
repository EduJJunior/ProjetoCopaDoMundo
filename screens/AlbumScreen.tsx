import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, Platform, GestureResponderEvent } from 'react-native';
import { albumData, CardItem } from '../data/mockData';
import { theme } from '../styles/theme';

type FilterType = 'all' | 'team' | 'player' | 'stadium' | 'mascot' | 'coach';

type AlbumCard = CardItem & {
  type: FilterType;
  title: string;
  subtitle: string;
  image: any;
  description: string;
  stats: string;
  curiosity: string;
};

const getItemType = (item: CardItem): FilterType => {
  if (item.type) return item.type as FilterType;
  const position = item.posicao?.toLowerCase() ?? '';
  if (position.includes('técnico') || position.includes('tecnico')) return 'coach';
  if (position === 'estádio' || position === 'estadio') return 'stadium';
  if (position === 'seleção' || position === 'selecao') return 'team';
  if (position === 'mascote') return 'mascot';
  return 'player';
};

const filterOptions: Array<{ key: FilterType; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'team', label: 'Seleções' },
  { key: 'player', label: 'Craques' },
  { key: 'stadium', label: 'Estádios' },
  { key: 'mascot', label: 'Mascotes' },
  { key: 'coach', label: 'Técnicos' }
];

export default function AlbumScreen({ navigation }: any) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const normalizedData: AlbumCard[] = useMemo(
    () => albumData.map((item) => ({
      ...item,
      type: getItemType(item),
      title: item.title ?? item.nome,
      subtitle: item.subtitle ?? `${item.selecao} • ${item.posicao}`,
      image: item.imagem,
      description: item.description ?? item.curiosidade,
      stats: item.stats ?? item.posicao,
      curiosity: item.curiosity ?? item.curiosidade
    })),
    []
  );

  const filteredData = useMemo(() => {
    return normalizedData.filter((item) => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const searchText = `${item.title} ${item.subtitle} ${item.description}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase().trim());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, normalizedData]);

  const favoritesCount = favoriteIds.length;

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]
    );
  };

  const renderCard = ({ item }: { item: AlbumCard }) => {
    const isFavorite = favoriteIds.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Details', { item })}
        accessibilityRole="button"
      >
        <Image source={item.image} style={styles.cardImage} />
        <TouchableOpacity
          style={[styles.favoriteAction, isFavorite && styles.favoriteActionActive]}
          onPress={(event: GestureResponderEvent) => {
            event.stopPropagation();
            toggleFavorite(item.id);
          }}
          accessibilityLabel={isFavorite ? 'Remover favorito' : 'Adicionar favorito'}
        >
          <Text style={[styles.favoriteActionText, isFavorite && styles.favoriteActionTextActive]}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text style={styles.cardTag}>{item.type?.toUpperCase() ?? 'FIGURINHA'}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>{item.subtitle}</Text>
          <Text style={styles.cardInfo} numberOfLines={2}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Álbum Digital da Copa</Text>
        <Text style={styles.headerSubtitle}>Tecnologia, cultura e coleção interativa em um app mobile.</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Itens visíveis</Text>
          <Text style={styles.summaryValue}>{filteredData.length} / {normalizedData.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Favoritos</Text>
          <Text style={styles.summaryValue}>{favoritesCount}</Text>
        </View>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar seleção, jogador, estádio ou curiosidade"
        placeholderTextColor={theme.colors.textLight}
        style={styles.searchInput}
      />

      <View style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[styles.filterButton, filter === option.key && styles.filterButtonActive]}
            onPress={() => setFilter(option.key)}
          >
            <Text style={[styles.filterText, filter === option.key && styles.filterTextActive]}>{option.label}</Text>
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
            <Text style={styles.emptyText}>Nenhum item encontrado para esta busca.</Text>
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
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 12 },
  summaryCard: { flex: 1, backgroundColor: theme.colors.surface, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border, marginRight: 10 },
  summaryLabel: { fontSize: 12, color: theme.colors.textLight, marginBottom: 6, textTransform: 'uppercase' },
  summaryValue: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
  searchInput: { margin: 16, padding: Platform.OS === 'ios' ? 16 : 12, backgroundColor: theme.colors.surface, borderRadius: 14, borderWidth: 1, borderColor: theme.colors.border, color: theme.colors.text },
  filterContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginVertical: 12, justifyContent: 'space-between' },
  filterButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 8, marginRight: 8 },
  filterButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterText: { fontSize: 12, color: theme.colors.textLight, fontWeight: '600' },
  filterTextActive: { color: theme.colors.surface },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  favoriteAction: { position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  favoriteActionActive: { backgroundColor: theme.colors.primary },
  favoriteActionText: { fontSize: 18, color: theme.colors.text },
  favoriteActionTextActive: { color: theme.colors.surface },
  cardContent: { padding: 16 },
  cardTag: { fontSize: 10, fontWeight: 'bold', color: theme.colors.secondary, marginBottom: 4, letterSpacing: 1 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
  cardSubtitle: { fontSize: 14, color: theme.colors.textLight, marginTop: 2 },
  cardInfo: { fontSize: 13, color: theme.colors.textLight, marginTop: 10, lineHeight: 20 },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: theme.colors.textLight, fontSize: 14 }
});