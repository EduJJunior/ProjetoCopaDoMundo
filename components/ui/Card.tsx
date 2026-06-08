import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  accent?: boolean;
  onPress?: () => void;
};

export default function Card({ children, style, elevated, accent, onPress }: CardProps) {
  const { theme } = useTheme();
  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: elevated ? theme.colors.surfaceElevated : theme.colors.surface,
          borderColor: accent ? theme.colors.secondary : theme.colors.border,
          borderLeftWidth: accent ? 4 : 1,
        },
        theme.shadows.sm,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
        {content}
      </Pressable>
    );
  }

  return content;
}

type StatCardProps = {
  label: string;
  value: string | number;
  style?: ViewStyle;
  onPress?: () => void;
  highlight?: boolean;
};

export function StatCard({ label, value, style, onPress, highlight }: StatCardProps) {
  const { theme } = useTheme();

  const inner = (
    <View
      style={[
        styles.stat,
        {
          backgroundColor: highlight ? theme.colors.primary : theme.colors.surface,
          borderColor: highlight ? theme.colors.primary : theme.colors.border,
        },
        theme.shadows.sm,
        style,
      ]}
    >
      <Text
        style={[
          styles.statLabel,
          {
            color: highlight ? 'rgba(255,255,255,0.85)' : theme.colors.textSecondary,
            fontFamily: theme.typography.fontMedium,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.statValue,
          {
            color: highlight ? theme.colors.textInverse : theme.colors.primary,
            fontFamily: theme.typography.fontBold,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.85 : 1 }]}>
        {inner}
      </Pressable>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  stat: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 17,
    marginTop: 4,
  },
});
