import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { albumData } from '../data/mockData';
import StickerCard from '../components/StickerCard';
import { resolveImageSource } from '../utils/stickerImage';
import {
  AlbumCard,
  AlbumPage,
  FilterType,
  buildAlbumPages,
  buildSelectionsSummary,
  normalizeAlbumData,
  HOME_GRID_COLS,
} from '../utils/albumPages';
import { searchAlbum } from '../utils/searchAlbum';
import ScreenHeader, { ScreenContainer } from '../components/ui/ScreenHeader';
import ThemeToggle from '../components/ui/ThemeToggle';
import SearchInput from '../components/ui/SearchInput';
import Chip from '../components/ui/Chip';
import SelectionsSheet from '../components/SelectionsSheet';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { AppTheme } from '../styles/theme';

const filterOptions: Array<{ key: FilterType; label: string; emoji: string }> = [
  { key: 'all', label: 'Todos', emoji: '📚' },
  { key: 'player', label: 'Craques', emoji: '⚽' },
  { key: 'team', label: 'Seleções', emoji: '🏳️' },
  { key: 'stadium', label: 'Estádios', emoji: '🏟️' },
  { key: 'mascot', label: 'Mascotes', emoji: '🐺' },
  { key: 'coach', label: 'Técnicos', emoji: '📋' },
];

const PAGE_PADDING = 12;
const STICKER_GAP = 10;
const BOTTOM_BAR_HEIGHT = 82;

function chunkStickers(stickers: AlbumCard[], cols: number): AlbumCard[][] {
  const rows: AlbumCard[][] = [];
  for (let i = 0; i < stickers.length; i += cols) {
    rows.push(stickers.slice(i, i + cols));
  }
  return rows;
}

export default function AlbumScreen({ navigation }: any) {
  const { width: screenWidth } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const pagerRef = useRef<FlatList>(null);

  const stickerWidth = useMemo(() => {
    const sheetWidth = screenWidth - PAGE_PADDING * 2;
    const innerWidth = sheetWidth - PAGE_PADDING * 2;
    return Math.floor((innerWidth - STICKER_GAP) / HOME_GRID_COLS);
  }, [screenWidth]);

  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const normalizedData = useMemo(() => normalizeAlbumData(albumData), []);

  const filteredData = useMemo(() => {
    return normalizedData.filter((item) => filter === 'all' || item.type === filter);
  }, [filter, normalizedData]);

  const searchResults = useMemo(
    () => (search.trim().length >= 2 ? searchAlbum(normalizedData, search) : { players: [], selections: [] }),
    [search, normalizedData]
  );

  const showSearch = search.trim().length >= 2;
  const hasSearchResults = searchResults.players.length > 0 || searchResults.selections.length > 0;

  const pages = useMemo(() => buildAlbumPages(filteredData), [filteredData]);
  const selectionsSummary = useMemo(
    () => buildSelectionsSummary(normalizedData, filter),
    [normalizedData, filter]
  );

  const onPageScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
      setCurrentPage(index);
    },
    [screenWidth]
  );

  const goToPage = (index: number) => {
    const safe = Math.max(0, Math.min(index, pages.length - 1));
    pagerRef.current?.scrollToIndex({ index: safe, animated: true });
    setCurrentPage(safe);
  };

  const openDetails = (item: AlbumCard) => {
    navigation.navigate('Details', { item: { ...item, image: resolveImageSource(item) } });
  };

  const goToCountryInAlbum = (country: string) => {
    const index = pages.findIndex((page) => page.country === country);
    if (index >= 0) goToPage(index);
  };

  const handleSheetSelect = (country: string) => {
    goToCountryInAlbum(country);
  };

  const openSelection = (country: string) => {
    setSearch('');
    navigation.navigate('Selection', { country, filter });
  };

  const openPlayerFromSearch = (item: AlbumCard) => {
    setSearch('');
    openDetails(item);
  };

  const renderStickerGrid = (page: AlbumPage) => {
    const rows = chunkStickers(page.stickers, HOME_GRID_COLS);

    return (
      <ScrollView
        style={styles.stickerScroll}
        contentContainerStyle={styles.stickerGridContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.stickerRow}>
            {row.map((sticker) => (
              <StickerCard
                key={sticker.id}
                item={sticker}
                width={stickerWidth}
                countryTheme={page.theme}
                isFavorite={isFavorite(sticker.id)}
                onPress={() => openDetails(sticker)}
                onToggleFavorite={() => toggleFavorite(sticker.id)}
                large
              />
            ))}
            {row.length < HOME_GRID_COLS
              ? Array.from({ length: HOME_GRID_COLS - row.length }).map((_, i) => (
                  <View key={`spacer-${i}`} style={{ width: stickerWidth }} />
                ))
              : null}
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderAlbumPage = ({ item: page }: { item: AlbumPage }) => (
    <View style={[styles.page, { width: screenWidth }]}>
      <View style={styles.albumSheet}>
        <View
          style={[
            styles.countryHeader,
            { backgroundColor: page.theme.primary, borderBottomColor: page.theme.secondary },
          ]}
        >
          <Text style={[styles.countryFlag, { color: page.theme.headerText }]}>{page.theme.flag}</Text>
          <View style={styles.countryHeaderText}>
            <Text style={[styles.countryName, { color: page.theme.headerText }]} numberOfLines={1}>
              {page.country}
            </Text>
            <Text style={[styles.countrySub, { color: page.theme.headerText }]}>
              Pág. {page.countryPage}/{page.countryTotalPages} • {page.stickers.length} figurinhas
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.viewAllBtn, { borderColor: page.theme.headerText }]}
            onPress={() => openSelection(page.country)}
            activeOpacity={0.8}
          >
            <Ionicons name="grid" size={13} color={page.theme.headerText} />
            <Text style={[styles.viewAllText, { color: page.theme.headerText }]}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {renderStickerGrid(page)}
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="Álbum da Copa"
          subtitle="Deslize para virar a página"
          emoji="⚽"
          compact
          rightAction={
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.favBtn}
                onPress={() => navigation.navigate('Favorites')}
                accessibilityLabel="Favoritos"
              >
                <Ionicons name="star" size={18} color="#FFF" />
                {favoriteIds.length > 0 ? (
                  <View style={styles.favBadge}>
                    <Text style={styles.favBadgeText}>{favoriteIds.length}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
              <ThemeToggle />
            </View>
          }
        />

        <View style={styles.toolbar}>
          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar jogador ou seleção..."
            containerStyle={styles.search}
          />

          {!showSearch ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filters}
              contentContainerStyle={styles.filtersContent}
            >
              {filterOptions.map((option) => (
                <Chip
                  key={option.key}
                  label={option.label}
                  emoji={option.emoji}
                  active={filter === option.key}
                  onPress={() => {
                    setFilter(option.key);
                    setCurrentPage(0);
                    pagerRef.current?.scrollToOffset({ offset: 0, animated: false });
                  }}
                />
              ))}
            </ScrollView>
          ) : null}
        </View>

        {showSearch && hasSearchResults ? (
          <View style={styles.searchPanel}>
            <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
              {searchResults.selections.length > 0 ? (
                <>
                  <Text style={styles.searchSectionTitle}>Seleções</Text>
                  {searchResults.selections.map((sel) => (
                    <TouchableOpacity
                      key={sel.country}
                      style={styles.searchItem}
                      onPress={() => openSelection(sel.country)}
                    >
                      <Text style={styles.searchFlag}>{sel.theme.flag}</Text>
                      <View style={styles.searchItemText}>
                        <Text style={styles.searchItemTitle}>{sel.country}</Text>
                        <Text style={styles.searchItemSub}>{sel.count} figurinhas</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                  ))}
                </>
              ) : null}
              {searchResults.players.length > 0 ? (
                <>
                  <Text style={[styles.searchSectionTitle, { marginTop: 10 }]}>
                    Jogadores ({searchResults.players.length})
                  </Text>
                  {searchResults.players.map((player) => (
                    <TouchableOpacity
                      key={player.id}
                      style={styles.searchItem}
                      onPress={() => openPlayerFromSearch(player)}
                    >
                      <View style={[styles.searchAvatar, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.searchAvatarText}>{(player.title ?? player.nome).charAt(0)}</Text>
                      </View>
                      <View style={styles.searchItemText}>
                        <Text style={styles.searchItemTitle}>{player.title ?? player.nome}</Text>
                        <Text style={styles.searchItemSub}>
                          {player.selecao} • {player.posicao}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                  ))}
                </>
              ) : null}
            </ScrollView>
          </View>
        ) : null}

        {!showSearch ? (
          pages.length > 0 ? (
            <>
              <FlatList
                ref={pagerRef}
                data={pages}
                keyExtractor={(page) => page.id}
                renderItem={renderAlbumPage}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onPageScroll}
                getItemLayout={(_, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                style={[styles.pager, { marginBottom: sheetOpen ? 0 : BOTTOM_BAR_HEIGHT }]}
                decelerationRate="fast"
              />

              <SelectionsSheet
                selections={selectionsSummary}
                currentCountry={pages[currentPage]?.country}
                onSelect={handleSheetSelect}
                onPrevPage={() => goToPage(currentPage - 1)}
                onNextPage={() => goToPage(currentPage + 1)}
                canPrev={currentPage > 0}
                canNext={currentPage < pages.length - 1}
                pageCountry={pages[currentPage]?.country ?? '—'}
                pageCounter={`${currentPage + 1} / ${pages.length}`}
                onOpenChange={setSheetOpen}
              />
            </>
          ) : (
            <View style={styles.emptyPage}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>Nenhuma figurinha neste filtro.</Text>
            </View>
          )
        ) : showSearch && !hasSearchResults ? (
          <View style={styles.emptyPage}>
            <Text style={styles.emptyText}>Nada encontrado para "{search}"</Text>
          </View>
        ) : null}
      </SafeAreaView>
    </ScreenContainer>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, position: 'relative' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    favBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    favBadge: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: theme.colors.secondary,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    favBadgeText: { fontSize: 9, fontFamily: theme.typography.fontBold, color: '#1B2838' },
    toolbar: {
      paddingHorizontal: PAGE_PADDING,
      paddingTop: 6,
      paddingBottom: 4,
      flexShrink: 0,
    },
    search: { marginHorizontal: 0, marginTop: 0 },
    filters: { marginTop: 8, maxHeight: 40 },
    filtersContent: { alignItems: 'center', paddingRight: 4 },
    searchPanel: {
      marginHorizontal: PAGE_PADDING,
      marginTop: 4,
      maxHeight: 220,
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 12,
      flexShrink: 0,
      ...theme.shadows.md,
    },
    searchSectionTitle: {
      fontSize: 11,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    searchItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchFlag: { fontSize: 22, marginRight: 12 },
    searchAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    searchAvatarText: { color: '#FFF', fontFamily: theme.typography.fontBold, fontSize: 15 },
    searchItemText: { flex: 1 },
    searchItemTitle: { fontSize: 14, fontFamily: theme.typography.fontSemiBold, color: theme.colors.text },
    searchItemSub: {
      fontSize: 12,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    pager: { flex: 1, flexGrow: 1 },
    page: {
      flex: 1,
      paddingHorizontal: PAGE_PADDING,
      paddingTop: 4,
      paddingBottom: 4,
    },
    albumSheet: {
      flex: 1,
      backgroundColor: theme.colors.albumSheet,
      borderRadius: 18,
      borderWidth: 3,
      borderColor: theme.colors.albumBorder,
      overflow: 'hidden',
      ...theme.shadows.md,
    },
    countryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 3,
      flexShrink: 0,
    },
    countryFlag: { fontSize: 28, marginRight: 8 },
    countryHeaderText: { flex: 1, minWidth: 0 },
    countryName: { fontSize: 16, fontFamily: theme.typography.fontBold },
    countrySub: { fontSize: 10, marginTop: 2, opacity: 0.9, fontFamily: theme.typography.fontRegular },
    viewAllBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: 16,
      paddingVertical: 5,
      paddingHorizontal: 8,
      gap: 3,
      flexShrink: 0,
    },
    viewAllText: { fontSize: 10, fontFamily: theme.typography.fontBold },
    stickerScroll: { flex: 1 },
    stickerGridContent: {
      padding: PAGE_PADDING,
      paddingBottom: PAGE_PADDING + 4,
    },
    stickerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: STICKER_GAP,
    },
    emptyPage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyText: {
      fontSize: 15,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });
}
