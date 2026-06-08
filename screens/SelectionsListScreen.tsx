import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { albumData } from '../data/mockData';
import { buildSelectionsSummary, FilterType, normalizeAlbumData } from '../utils/albumPages';
import ScreenHeader, { ScreenContainer } from '../components/ui/ScreenHeader';
import ThemeToggle from '../components/ui/ThemeToggle';
import SearchInput from '../components/ui/SearchInput';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';
import { normalizeSearch } from '../utils/searchAlbum';

export default function SelectionsListScreen({ route, navigation }: any) {
  const { filter = 'all' } = route.params ?? {};
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [query, setQuery] = useState('');

  const selections = useMemo(() => {
    const normalized = normalizeAlbumData(albumData);
    const all = buildSelectionsSummary(normalized, filter as FilterType);
    const q = normalizeSearch(query);
    if (!q) return all;
    return all.filter((item) => normalizeSearch(item.country).includes(q));
  }, [filter, query]);

  const totalStickers = useMemo(
    () => selections.reduce((sum, item) => sum + item.count, 0),
    [selections]
  );

  const openSelection = (country: string) => {
    navigation.navigate('Selection', { country, filter });
  };

  const renderItem = ({ item }: { item: (typeof selections)[0] }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.85}
      onPress={() => openSelection(item.country)}
    >
      <View style={[styles.flagCircle, { backgroundColor: item.theme.primary }]}>
        <Text style={styles.flag}>{item.theme.flag}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.countryName}>{item.country}</Text>
        <Text style={styles.countryMeta}>
          {item.count} figurinha{item.count !== 1 ? 's' : ''}
        </Text>
      </View>
      <View style={[styles.countBadge, { borderColor: item.theme.secondary }]}>
        <Text style={[styles.countText, { color: theme.colors.primary }]}>{item.count}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="Todas as Seleções"
          subtitle={`${selections.length} seleções • ${totalStickers} figurinhas`}
          emoji="🏳️"
          rightAction={
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={22} color="#FFF" />
              </TouchableOpacity>
              <ThemeToggle />
            </View>
          }
        />

        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Filtrar seleção..."
          containerStyle={styles.search}
        />

        <FlatList
          data={selections}
          keyExtractor={(item) => item.country}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhuma seleção encontrada.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </ScreenContainer>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    search: { marginHorizontal: 12, marginTop: 10, marginBottom: 4 },
    list: { paddingHorizontal: 12, paddingBottom: 24 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 14,
      marginBottom: 10,
      ...theme.shadows.sm,
    },
    flagCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    flag: { fontSize: 24 },
    rowText: { flex: 1 },
    countryName: {
      fontSize: 16,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
    },
    countryMeta: {
      fontSize: 12,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    countBadge: {
      borderWidth: 1.5,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginRight: 8,
    },
    countText: {
      fontSize: 13,
      fontFamily: theme.typography.fontBold,
    },
    empty: { padding: 40, alignItems: 'center' },
    emptyText: {
      fontSize: 15,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
    },
  });
}
