import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import StickerImage from './StickerImage';
import { resolveImageSource } from '../utils/stickerImage';
import { getCountryCode } from '../data/countryThemes';
import { AlbumCard, getStickerRole } from '../utils/albumPages';
import { CountryTheme } from '../data/countryThemes';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

type StickerCardProps = {
  item: AlbumCard;
  width: number;
  countryTheme?: CountryTheme;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: (event?: GestureResponderEvent) => void;
  style?: ViewStyle;
  large?: boolean;
};

export default function StickerCard({
  item,
  width,
  countryTheme,
  isFavorite,
  onPress,
  onToggleFavorite,
  style,
  large,
}: StickerCardProps) {
  const { theme } = useTheme();
  const imageSource = resolveImageSource(item);
  const code = getCountryCode(item.selecao);
  const stickerBg = countryTheme?.stickerBg ?? theme.colors.surface;
  const nameBar = countryTheme?.nameBar ?? theme.colors.gradientEnd;

  return (
    <TouchableOpacity
      style={[styles.wrap, { width }, style]}
      activeOpacity={0.88}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Figurinha ${item.title}`}
    >
      <View style={[styles.inner, { backgroundColor: stickerBg, borderColor: theme.colors.albumBorder }]}>
        <View style={styles.topRow}>
          <Text style={[styles.code, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontBold }]}>
            {code} {String(item.stickerNumber).padStart(2, '0')}
          </Text>
          <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={[styles.star, isFavorite && { color: theme.colors.secondary }]}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        <StickerImage
          item={item}
          source={imageSource}
          style={[styles.photoWrap, large && styles.photoWrapLarge]}
          imageStyle={styles.photo}
        />

        <View style={[styles.nameBar, { backgroundColor: nameBar }]}>
          <Text
            style={[
              styles.name,
              large && styles.nameLarge,
              { fontFamily: theme.typography.fontBold },
            ]}
            numberOfLines={large ? 2 : 1}
          >
            {item.title.toUpperCase()}
          </Text>
          {large ? (
            <Text style={[styles.position, { fontFamily: theme.typography.fontMedium }]} numberOfLines={1}>
              {getStickerRole(item)}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  inner: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  code: { fontSize: 10 },
  star: { fontSize: 16, color: '#999' },
  photoWrap: { width: '100%', aspectRatio: 0.82 },
  photoWrapLarge: { aspectRatio: 0.78 },
  photo: { width: '100%', height: '100%' },
  nameBar: { paddingVertical: 8, paddingHorizontal: 6, minHeight: 30, justifyContent: 'center' },
  name: { color: '#FFF', fontSize: 10, textAlign: 'center', letterSpacing: 0.4 },
  nameLarge: { fontSize: 12, lineHeight: 15 },
  position: { color: 'rgba(255,255,255,0.75)', fontSize: 9, textAlign: 'center', marginTop: 2 },
});

export function calcStickerWidth(
  screenWidth: number,
  cols: number,
  horizontalPadding = 16,
  gap = 12
): number {
  const totalGap = gap * (cols - 1);
  return (screenWidth - horizontalPadding * 2 - totalGap) / cols;
}

export function createStickerGridStyles(theme: AppTheme, gap: number) {
  return StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: gap,
    },
  });
}
