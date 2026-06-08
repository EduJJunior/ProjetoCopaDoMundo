import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type ChipProps = {
  label: string;
  emoji?: string;
  active?: boolean;
  onPress: () => void;
};

export default function Chip({ label, emoji, active, onPress }: ChipProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? colors.chipActive : colors.chip,
          borderColor: active ? colors.chipActive : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
        !active && theme.shadows.sm,
      ]}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text
        style={[
          styles.label,
          {
            color: active ? colors.chipTextActive : colors.chipText,
            fontFamily: theme.typography.fontSemiBold,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  emoji: {
    fontSize: 13,
    marginRight: 5,
  },
  label: {
    fontSize: 12,
  },
});
