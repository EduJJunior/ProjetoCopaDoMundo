import React from 'react';
import { Platform, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

type SearchInputProps = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
};

export default function SearchInput({ icon = 'search', style, containerStyle, ...props }: SearchInputProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.colors.inputBg,
          borderColor: theme.colors.border,
        },
        theme.shadows.sm,
        containerStyle,
      ]}
    >
      <Ionicons name={icon} size={18} color={theme.colors.textSecondary} style={styles.icon} />
      <TextInput
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            color: theme.colors.text,
            fontFamily: theme.typography.fontRegular,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15,
  },
});
