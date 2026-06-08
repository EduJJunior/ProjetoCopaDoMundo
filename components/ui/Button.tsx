import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  style,
  fullWidth,
}: ButtonProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const variantStyles = {
    primary: { bg: colors.primary, text: colors.textInverse, border: colors.primary },
    secondary: { bg: colors.surfaceElevated, text: colors.text, border: colors.border },
    outline: { bg: 'transparent', text: colors.primary, border: colors.primary },
    ghost: { bg: 'transparent', text: colors.textSecondary, border: 'transparent' },
    gold: { bg: colors.secondary, text: colors.textInverse, border: colors.secondary },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: disabled ? colors.border : variantStyles.bg,
          borderColor: variantStyles.border,
          opacity: pressed ? 0.85 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        theme.shadows.sm,
        style,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={disabled ? colors.textSecondary : variantStyles.text}
          style={styles.icon}
        />
      ) : null}
      <Text
        style={[
          styles.label,
          {
            color: disabled ? colors.textSecondary : variantStyles.text,
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
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
  },
});
