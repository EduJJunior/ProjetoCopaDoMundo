import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SelectionSummary } from '../utils/albumPages';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const SHEET_HEIGHT = Math.min(SCREEN_HEIGHT * 0.58, 440);
const TIMING = { duration: 220, easing: Easing.out(Easing.cubic) };

type SelectionsSheetProps = {
  selections: SelectionSummary[];
  currentCountry?: string;
  onSelect: (country: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  canPrev: boolean;
  canNext: boolean;
  pageCountry: string;
  pageCounter: string;
  onOpenChange?: (open: boolean) => void;
};

export default function SelectionsSheet({
  selections,
  currentCountry,
  onSelect,
  onPrevPage,
  onNextPage,
  canPrev,
  canNext,
  pageCountry,
  pageCounter,
  onOpenChange,
}: SelectionsSheetProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const translateY = useSharedValue(SHEET_HEIGHT);
  const [sheetOpen, setSheetOpen] = useState(false);

  const notifyOpen = useCallback(
    (open: boolean) => {
      setSheetOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  const openSheet = useCallback(() => {
    translateY.value = withTiming(0, TIMING);
    notifyOpen(true);
  }, [translateY, notifyOpen]);

  const closeSheet = useCallback(() => {
    translateY.value = withTiming(SHEET_HEIGHT, TIMING);
    notifyOpen(false);
  }, [translateY, notifyOpen]);

  const openGesture = Gesture.Pan()
    .activeOffsetY(-8)
    .failOffsetX([-20, 20])
    .onUpdate((e) => {
      if (e.translationY < 0) {
        translateY.value = Math.max(0, SHEET_HEIGHT + e.translationY);
      }
    })
    .onEnd((e) => {
      if (e.translationY < -28 || e.velocityY < -350) {
        translateY.value = withTiming(0, TIMING);
        runOnJS(notifyOpen)(true);
      } else {
        translateY.value = withTiming(SHEET_HEIGHT, TIMING);
      }
    });

  const closeGesture = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetX([-20, 20])
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = Math.min(SHEET_HEIGHT, e.translationY);
      }
    })
    .onEnd((e) => {
      if (e.translationY > 28 || e.velocityY > 350) {
        translateY.value = withTiming(SHEET_HEIGHT, TIMING);
        runOnJS(notifyOpen)(false);
      } else {
        translateY.value = withTiming(0, TIMING);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: Math.max(0, 0.45 * (1 - translateY.value / SHEET_HEIGHT)),
  }));

  const handleSelect = (country: string) => {
    onSelect(country);
    closeSheet();
  };

  const renderItem = ({ item }: { item: SelectionSummary }) => {
    const active = item.country === currentCountry;
    return (
      <TouchableOpacity
        style={[styles.row, active && styles.rowActive]}
        onPress={() => handleSelect(item.country)}
        activeOpacity={0.85}
      >
        <View style={[styles.flagCircle, { backgroundColor: item.theme.primary }]}>
          <Text style={styles.flag}>{item.theme.flag}</Text>
        </View>
        <View style={styles.rowText}>
          <Text style={styles.countryName}>{item.country}</Text>
          <Text style={styles.countryMeta}>{item.count} figurinhas</Text>
        </View>
        <Text style={styles.countBadge}>{item.count}</Text>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {sheetOpen ? (
        <Animated.View style={[styles.backdrop, backdropStyle]} pointerEvents="none" />
      ) : null}

      <Animated.View style={[styles.sheet, sheetStyle]} pointerEvents={sheetOpen ? 'auto' : 'none'}>
        <GestureDetector gesture={closeGesture}>
          <View style={styles.sheetHeader}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Todas as seleções</Text>
            <Text style={styles.sheetSub}>
              {selections.length} seleções • deslize ↓ para fechar
            </Text>
          </View>
        </GestureDetector>

        <FlatList
          data={selections}
          keyExtractor={(item) => item.country}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </Animated.View>

      {!sheetOpen ? (
        <View style={styles.bar}>
          <GestureDetector gesture={openGesture}>
            <View style={styles.handleBar}>
              <View style={styles.handlePill} />
              <Text style={styles.swipeHint}>Deslize ↑ para ver seleções</Text>
            </View>
          </GestureDetector>

          <View style={styles.navRow}>
              <TouchableOpacity
                style={[styles.navBtn, !canPrev && styles.navBtnDisabled]}
                onPress={onPrevPage}
                disabled={!canPrev}
              >
                <Ionicons name="chevron-back" size={22} color={theme.colors.primary} />
              </TouchableOpacity>

              <View style={styles.pageInfo}>
                <Text style={styles.pageCountry} numberOfLines={1}>
                  {pageCountry}
                </Text>
                <Text style={styles.pageCounter}>{pageCounter}</Text>
              </View>

              <TouchableOpacity
                style={[styles.navBtn, !canNext && styles.navBtnDisabled]}
                onPress={onNextPage}
                disabled={!canNext}
              >
                <Ionicons name="chevron-forward" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
      ) : null}
    </>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: '#000',
      zIndex: 10,
    },
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: SHEET_HEIGHT,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      zIndex: 11,
      ...theme.shadows.md,
    },
    sheetHeader: {
      alignItems: 'center',
      paddingTop: 12,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    handle: {
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.colors.borderStrong,
      marginBottom: 10,
    },
    sheetTitle: {
      fontSize: 16,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
    },
    sheetSub: {
      fontSize: 11,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    list: { padding: 12, paddingBottom: 24 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: theme.colors.backgroundAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    rowActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.mode === 'dark' ? 'rgba(224, 69, 106, 0.12)' : 'rgba(139, 21, 56, 0.08)',
    },
    flagCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    flag: { fontSize: 20 },
    rowText: { flex: 1 },
    countryName: {
      fontSize: 14,
      fontFamily: theme.typography.fontSemiBold,
      color: theme.colors.text,
    },
    countryMeta: {
      fontSize: 11,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      marginTop: 1,
    },
    countBadge: {
      fontSize: 13,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.primary,
      marginRight: 6,
    },
    bar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      zIndex: 12,
      paddingBottom: 4,
    },
    handleBar: {
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 4,
    },
    handlePill: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.borderStrong,
      marginBottom: 4,
    },
    swipeHint: {
      fontSize: 10,
      fontFamily: theme.typography.fontMedium,
      color: theme.colors.textSecondary,
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    navBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.backgroundAlt,
    },
    navBtnDisabled: { opacity: 0.35 },
    pageInfo: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
    pageCountry: {
      fontSize: 14,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
    },
    pageCounter: {
      fontSize: 11,
      fontFamily: theme.typography.fontMedium,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });
}
