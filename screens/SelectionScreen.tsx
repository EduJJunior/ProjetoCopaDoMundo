import React, { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { albumData } from '../data/mockData';
import StickerCard from '../components/StickerCard';
import { resolveImageSource } from '../utils/stickerImage';
import { getCountryTheme } from '../data/countryThemes';
import { AlbumCard, FilterType, normalizeAlbumData } from '../utils/albumPages';
import { ScreenContainer } from '../components/ui/ScreenHeader';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { AppTheme } from '../styles/theme';

const COLS = 2;
const GAP = 12;
const H_PADDING = 16;

export default function SelectionScreen({ route, navigation }: any) {
  const { width: screenWidth } = useWindowDimensions();
  const stickerWidth = Math.floor((screenWidth - H_PADDING * 2 - GAP) / COLS);
  const { country, filter = 'all' } = route.params;
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { isFavorite, toggleFavorite } = useFavorites();
  const countryTheme = getCountryTheme(country);

  const items = useMemo(() => {
    const normalized = normalizeAlbumData(albumData);
    return normalized.filter((item) => {
      const matchesCountry = item.selecao === country;
      const matchesFilter = filter === 'all' || item.type === filter;
      return matchesCountry && matchesFilter;
    });
  }, [country, filter]);

  const openDetails = (item: AlbumCard) => {
    const imageSource = resolveImageSource(item);
    navigation.navigate('Details', { item: { ...item, image: imageSource } });
  };

  const renderItem = ({ item }: { item: AlbumCard }) => (
    <StickerCard
      item={item}
      width={stickerWidth}
      countryTheme={countryTheme}
      isFavorite={isFavorite(item.id)}
      onPress={() => openDetails(item)}
      onToggleFavorite={() => toggleFavorite(item.id)}
      large
    />
  );

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={[countryTheme.primary, countryTheme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="arrow-back" size={24} color={countryTheme.headerText} />
            </TouchableOpacity>
            <Text style={[styles.flag, { color: countryTheme.headerText }]}>{countryTheme.flag}</Text>
          </View>
          <Text style={[styles.heroTitle, { color: countryTheme.headerText }]}>{country}</Text>
          <Text style={[styles.heroSub, { color: countryTheme.headerText }]}>
            {items.length} figurinha{items.length !== 1 ? 's' : ''} no álbum
          </Text>
        </LinearGradient>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={COLS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhuma figurinha nesta seleção.</Text>
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
    hero: {
      paddingHorizontal: 20,
      paddingBottom: 22,
      paddingTop: 8,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    heroTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    backBtn: { marginRight: 12, padding: 4 },
    flag: { fontSize: 36 },
    heroTitle: {
      fontSize: 28,
      fontFamily: theme.typography.fontBold,
      letterSpacing: 0.5,
    },
    heroSub: {
      fontSize: 14,
      fontFamily: theme.typography.fontRegular,
      opacity: 0.9,
      marginTop: 4,
    },
    list: { paddingTop: 16, paddingHorizontal: H_PADDING, paddingBottom: 32 },
    row: { justifyContent: 'space-between', marginBottom: GAP },
    empty: { padding: 40, alignItems: 'center' },
    emptyText: {
      fontSize: 15,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
    },
  });
}
