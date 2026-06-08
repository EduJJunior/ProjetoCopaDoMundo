import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  emoji?: string;
  rightAction?: React.ReactNode;
  compact?: boolean;
};

export default function ScreenHeader({ title, subtitle, emoji, rightAction, compact }: ScreenHeaderProps) {
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrapper, compact && styles.wrapperCompact, theme.shadows.sm]}
    >
      <View style={styles.content}>
        <View style={styles.textBlock}>
          {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
          <View style={styles.titles}>
            <Text style={[styles.title, { fontFamily: theme.typography.fontBold }]}>{title}</Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { fontFamily: theme.typography.fontRegular }]}>{subtitle}</Text>
            ) : null}
          </View>
        </View>
        {rightAction ? <View style={styles.action}>{rightAction}</View> : null}
      </View>
      <View style={styles.accentLine} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  wrapperCompact: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  titles: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 3,
    lineHeight: 18,
  },
  action: {
    marginLeft: 12,
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: 'rgba(245, 200, 66, 0.7)',
    borderRadius: 2,
  },
});

export function ScreenContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}>
      {children}
    </View>
  );
}
