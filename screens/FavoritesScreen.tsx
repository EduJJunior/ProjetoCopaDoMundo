import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { albumData } from '../data/mockData';
import StickerImage from '../components/StickerImage';
import { resolveImageSource } from '../utils/stickerImage';
import { getCountryCode } from '../data/countryThemes';
import { normalizeAlbumData, AlbumCard } from '../utils/albumPages';
import ScreenHeader, { ScreenContainer } from '../components/ui/ScreenHeader';
import ThemeToggle from '../components/ui/ThemeToggle';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { AppTheme } from '../styles/theme';

const screenWidth = Dimensions.get('window').width;
const cols = 2;
const gap = 10;
const stickerWidth = (screenWidth - 32 - gap * (cols - 1)) / cols;

export default function FavoritesScreen({ navigation }: any) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { favoriteIds } = useFavorites();

  const favoriteItems = useMemo(() => {
    const normalized = normalizeAlbumData(albumData);
    return favoriteIds
      .map((id) => normalized.find((item) => item.id === id))
      .filter((item): item is AlbumCard => Boolean(item));
  }, [favoriteIds]);

  const renderItem = ({ item }: { item: AlbumCard }) => {
    const imageSource = resolveImageSource(item);
    const code = getCountryCode(item.selecao);

    return (
      <TouchableOpacity
        style={[styles.sticker, { width: stickerWidth }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Details', { item: { ...item, image: imageSource } })}
      >
        <View style={styles.stickerInner}>
          <View style={styles.stickerTopRow}>
            <Text style={styles.stickerCode}>
              {code} {String(item.stickerNumber).padStart(2, '0')}
            </Text>
            <Text style={styles.favoriteIcon}>★</Text>
          </View>
          <StickerImage item={item} source={imageSource} style={styles.photoWrap} imageStyle={styles.photo} />
          <View style={styles.nameBar}>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.title.toUpperCase()}
            </Text>
            <Text style={styles.selecaoText} numberOfLines={1}>
              {item.selecao}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="Meus Favoritos"
          subtitle={`${favoriteItems.length} figurinha${favoriteItems.length !== 1 ? 's' : ''} salva${favoriteItems.length !== 1 ? 's' : ''}`}
          emoji="★"
          rightAction={<ThemeToggle />}
        />

        {favoriteItems.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>☆</Text>
            <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
            <Text style={styles.emptyText}>
              Toque na estrela de uma figurinha no álbum ou nos detalhes para salvar aqui.
            </Text>
            <Button
              label="Ir para o Álbum"
              icon="book"
              variant="primary"
              onPress={() => navigation.navigate('AlbumMain')}
              style={styles.emptyBtn}
            />
          </View>
        ) : (
          <FlatList
            data={favoriteItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={cols}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </ScreenContainer>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1 },
    list: { padding: 16, paddingBottom: 24 },
    row: { gap: 10, marginBottom: 10 },
    sticker: {},
    stickerInner: {
      borderRadius: 14,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: theme.colors.secondary,
      backgroundColor: theme.colors.surface,
      ...theme.shadows.md,
    },
    stickerTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingTop: 6,
    },
    stickerCode: {
      fontSize: 10,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.textSecondary,
    },
    favoriteIcon: { fontSize: 14, color: theme.colors.secondary },
    photoWrap: { width: '100%', aspectRatio: 0.9 },
    photo: { width: '100%', height: '100%' },
    nameBar: {
      backgroundColor: theme.colors.gradientEnd,
      paddingVertical: 8,
      paddingHorizontal: 6,
    },
    nameText: {
      color: '#FFF',
      fontSize: 11,
      fontFamily: theme.typography.fontBold,
      textAlign: 'center',
    },
    selecaoText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 9,
      fontFamily: theme.typography.fontMedium,
      textAlign: 'center',
      marginTop: 2,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    emptyEmoji: { fontSize: 56, color: theme.colors.secondary, marginBottom: 12 },
    emptyTitle: {
      fontSize: 20,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    emptyBtn: { marginTop: 24, minWidth: 200 },
  });
}
