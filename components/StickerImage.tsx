import React, { useState } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { getStickerEmoji, getStickerImageUri } from '../utils/stickerImage';
import { theme } from '../styles/theme';

type StickerImageProps = {
  item: {
    id: string;
    nome: string;
    title?: string;
    type?: string;
    selecao?: string;
    imagem?: unknown;
  };
  source: { uri: string } | number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export default function StickerImage({ item, source, style, imageStyle }: StickerImageProps) {
  const [failed, setFailed] = useState(false);
  const fallbackUri = getStickerImageUri(item);
  const resolvedSource = failed ? { uri: fallbackUri } : source;

  return (
    <View style={[styles.container, style]}>
      {!failed ? (
        <Image
          source={resolvedSource}
          style={[styles.image, imageStyle]}
          onError={() => setFailed(true)}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, imageStyle]}>
          <Text style={styles.emoji}>{getStickerEmoji(item.type)}</Text>
          <Text style={styles.initials} numberOfLines={2}>
            {(item.title ?? item.nome).split(' ').slice(0, 2).map((w) => w[0]).join('')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: theme.colors.border },
  image: { width: '100%', height: '100%' },
  fallback: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  emoji: { fontSize: 28, marginBottom: 4 },
  initials: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
