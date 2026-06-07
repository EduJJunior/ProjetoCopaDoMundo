import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  GestureResponderEvent,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { albumData } from '../data/mockData';
import { theme } from '../styles/theme';
import StickerImage from '../components/StickerImage';
import { resolveImageSource } from '../utils/stickerImage';
import { getCountryCode } from '../data/countryThemes';
import {
  AlbumCard,
  AlbumPage,
  FilterType,
  buildAlbumPages,
  normalizeAlbumData,
  GRID_COLS,
  STICKERS_PER_PAGE,
} from '../utils/albumPages';

const filterOptions: Array<{ key: FilterType; label: string; emoji: string }> = [
  { key: 'all', label: 'Todos', emoji: '📚' },
  { key: 'player', label: 'Craques', emoji: '⚽' },
  { key: 'team', label: 'Seleções', emoji: '🏳️' },
  { key: 'stadium', label: 'Estádios', emoji: '🏟️' },
  { key: 'mascot', label: 'Mascotes', emoji: '🐺' },
  { key: 'coach', label: 'Técnicos', emoji: '📋' },
];

const screenWidth = Dimensions.get('window').width;
const sheetPadding = 10;
const stickerGap = 6;
const stickerWidth = (screenWidth - 32 - sheetPadding * 2 - stickerGap * (GRID_COLS - 1)) / GRID_COLS;

export default function AlbumScreen({ navigation }: any) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const normalizedData = useMemo(() => normalizeAlbumData(albumData), []);

  const filteredData = useMemo(() => {
    return normalizedData.filter((item) => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const searchText = `${item.title} ${item.subtitle} ${item.description} ${item.selecao}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase().trim());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, normalizedData]);

  const pages = useMemo(() => buildAlbumPages(filteredData), [filteredData]);
  const activePage: AlbumPage | undefined = pages[currentPage];
  const favoritesCount = favoriteIds.length;

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, pages.length - 1)));
  };

  const handleFilterChange = (key: FilterType) => {
    setFilter(key);
    setCurrentPage(0);
  };

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setCurrentPage(0);
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]
    );
  };

  const renderSticker = (item: AlbumCard) => {
    const isFavorite = favoriteIds.includes(item.id);
    const imageSource = resolveImageSource(item);
    const code = getCountryCode(item.selecao);
    const pageTheme = activePage?.theme;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.sticker, { width: stickerWidth }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Details', { item: { ...item, image: imageSource } })}
        accessibilityRole="button"
        accessibilityLabel={`Figurinha ${item.stickerNumber}, ${item.title}`}
      >
        <View style={[styles.stickerInner, { backgroundColor: pageTheme?.stickerBg ?? '#FFF' }]}>
          <View style={styles.stickerTopRow}>
            <Text style={styles.stickerCode}>
              {code} {String(item.stickerNumber).padStart(2, '0')}
            </Text>
            <TouchableOpacity
              onPress={(event: GestureResponderEvent) => {
                event.stopPropagation();
                toggleFavorite(item.id);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.favoriteIcon}>{isFavorite ? '★' : '☆'}</Text>
            </TouchableOpacity>
          </View>

          <StickerImage
            item={item}
            source={imageSource}
            style={styles.photoWrap}
            imageStyle={styles.photo}
          />

          <View style={[styles.nameBar, { backgroundColor: pageTheme?.nameBar ?? '#1B2838' }]}>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.title.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptySlot = (index: number) => (
    <View key={`empty-${index}`} style={[styles.sticker, styles.emptySlot, { width: stickerWidth }]}>
      <View style={styles.emptyInner}>
        <Text style={styles.emptyText}>—</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 Álbum Digital da Copa</Text>
        <Text style={styles.headerSubtitle}>Páginas por seleção — estilo álbum Panini</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Figurinhas</Text>
          <Text style={styles.summaryValue}>
            {filteredData.length} / {normalizedData.length}
          </Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardLast]}>
          <Text style={styles.summaryLabel}>Páginas</Text>
          <Text style={styles.summaryValue}>{pages.length}</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardLast]}>
          <Text style={styles.summaryLabel}>Favoritos</Text>
          <Text style={styles.summaryValue}>{favoritesCount}</Text>
        </View>
      </View>

      <TextInput
        value={search}
        onChangeText={handleSearchChange}
        placeholder="Buscar jogador ou seleção..."
        placeholderTextColor={theme.colors.textLight}
        style={styles.searchInput}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[styles.filterButton, filter === option.key && styles.filterButtonActive]}
            onPress={() => handleFilterChange(option.key)}
          >
            <Text style={styles.filterEmoji}>{option.emoji}</Text>
            <Text style={[styles.filterText, filter === option.key && styles.filterTextActive]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activePage ? (
        <View style={styles.albumSheet}>
          <View
            style={[
              styles.countryHeader,
              { backgroundColor: activePage.theme.primary, borderBottomColor: activePage.theme.secondary },
            ]}
          >
            <Text style={[styles.countryFlag, { color: activePage.theme.headerText }]}>{activePage.theme.flag}</Text>
            <View style={styles.countryHeaderText}>
              <Text style={[styles.countryName, { color: activePage.theme.headerText }]}>{activePage.country}</Text>
              <Text style={[styles.countrySub, { color: activePage.theme.headerText }]}>
                Página {activePage.countryPage} de {activePage.countryTotalPages} • Álbum {activePage.pageIndex + 1}/{activePage.totalPages}
              </Text>
            </View>
          </View>

          <View style={styles.stickerGrid}>
            {activePage.stickers.map((item) => renderSticker(item))}
            {activePage.stickers.length < STICKERS_PER_PAGE &&
              Array.from({ length: STICKERS_PER_PAGE - activePage.stickers.length }).map((_, i) => renderEmptySlot(i))}
          </View>

          <View style={[styles.sheetFooter, { backgroundColor: activePage.theme.secondary }]}>
            <Text style={styles.sheetFooterText}>
              {activePage.stickers.length} figurinhas nesta página • Toque para ver detalhes
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyPage}>
          <Text style={styles.emptyPageEmoji}>🔍</Text>
          <Text style={styles.emptyPageText}>Nenhuma figurinha encontrada.</Text>
        </View>
      )}

      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 0 && styles.pageButtonDisabled]}
          onPress={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <Text style={styles.pageButtonText}>◀ Anterior</Text>
        </TouchableOpacity>

        <Text style={styles.pageLabel}>
          {activePage ? `${activePage.country}` : '—'}
        </Text>

        <TouchableOpacity
          style={[styles.pageButton, currentPage >= pages.length - 1 && styles.pageButtonDisabled]}
          onPress={() => goToPage(currentPage + 1)}
          disabled={currentPage >= pages.length - 1}
        >
          <Text style={styles.pageButtonText}>Próxima ▶</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8DCC8' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary },
  headerSubtitle: { fontSize: 12, color: theme.colors.textLight, marginTop: 2 },
  summaryContainer: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 8 },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 6,
  },
  summaryCardLast: { marginRight: 0 },
  summaryLabel: { fontSize: 10, color: theme.colors.textLight, textTransform: 'uppercase' },
  summaryValue: { fontSize: 15, fontWeight: 'bold', color: theme.colors.text, marginTop: 2 },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: Platform.OS === 'ios' ? 12 : 10,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    fontSize: 14,
  },
  filterScroll: { maxHeight: 44, marginTop: 8 },
  filterContainer: { paddingHorizontal: 16, alignItems: 'center' },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 6,
  },
  filterButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterEmoji: { fontSize: 12, marginRight: 4 },
  filterText: { fontSize: 11, color: theme.colors.textLight, fontWeight: '600' },
  filterTextActive: { color: theme.colors.surface },
  albumSheet: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    backgroundColor: '#FFFBF5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C9A227',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 4,
  },
  countryFlag: { fontSize: 28, marginRight: 10 },
  countryHeaderText: { flex: 1 },
  countryName: { fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
  countrySub: { fontSize: 11, marginTop: 2, opacity: 0.9 },
  stickerGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: sheetPadding,
    alignContent: 'flex-start',
  },
  sticker: { marginBottom: stickerGap, marginRight: stickerGap },
  stickerInner: {
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D4C4A8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  stickerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 3,
  },
  stickerCode: { fontSize: 8, fontWeight: 'bold', color: '#666' },
  favoriteIcon: { fontSize: 11, color: theme.colors.primary },
  photoWrap: { width: '100%', aspectRatio: 0.85 },
  photo: { width: '100%', height: '100%' },
  nameBar: { paddingVertical: 4, paddingHorizontal: 3, minHeight: 22, justifyContent: 'center' },
  nameText: { color: '#FFF', fontSize: 8, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.3 },
  emptySlot: { opacity: 0.35 },
  emptyInner: {
    aspectRatio: 0.72,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4C4A8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F0E6',
  },
  emptyText: { fontSize: 18, color: '#BBB' },
  sheetFooter: { paddingVertical: 6, paddingHorizontal: 10 },
  sheetFooterText: { fontSize: 10, color: '#1B2838', textAlign: 'center', fontWeight: '600' },
  emptyPage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyPageEmoji: { fontSize: 40 },
  emptyPageText: { color: theme.colors.textLight, marginTop: 8 },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 4,
  },
  pageButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  pageButtonDisabled: { backgroundColor: theme.colors.border },
  pageButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  pageLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.text, maxWidth: 100, textAlign: 'center' },
});
