import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { theme } from '../styles/theme';
import StickerImage from '../components/StickerImage';
import { resolveImageSource } from '../utils/stickerImage';

export default function DetailsScreen({ route }: any) {
  const { item } = route.params;
  const [favorite, setFavorite] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const title = item.title ?? item.nome;
  const subtitle = item.subtitle ?? `${item.selecao} • ${item.posicao}`;
  const description = item.description ?? `Figurinha da seleção ${item.selecao}. ${item.curiosidade}`;
  const stats = item.stats ?? item.posicao;
  const curiosity = item.curiosity ?? item.curiosidade;
  const typeLabel = item.type
    ? item.type === 'coach'
      ? 'TÉCNICO'
      : item.type === 'team'
      ? 'SELEÇÃO'
      : item.type === 'stadium'
      ? 'ESTÁDIO'
      : item.type.toUpperCase()
    : item.posicao;

  const imageSource = resolveImageSource(item);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const buildSpeechText = () =>
    `${typeLabel}. ${title}. ${subtitle}. História e descrição: ${description}. Informações: ${stats}. Curiosidade: ${curiosity}`;

  const handleAccessibilitySpeech = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    Speech.speak(buildSpeechText(), {
      language: 'pt-BR',
      rate: 0.92,
      pitch: 1,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleToggleFavorite = () => {
    setFavorite((prev) => !prev);
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.imageFrame}>
        <StickerImage item={item} source={imageSource} style={styles.imageWrap} imageStyle={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={styles.typeTag}>{typeLabel}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <TouchableOpacity
          style={[styles.audioButton, isSpeaking && styles.audioButtonActive]}
          onPress={handleAccessibilitySpeech}
          accessibilityRole="button"
          accessibilityLabel={isSpeaking ? 'Parar leitura em voz alta' : 'Ouvir descrição em voz alta'}
        >
          <Text style={[styles.audioButtonText, isSpeaking && styles.audioButtonTextActive]}>
            {isSpeaking ? '⏹ Parar leitura' : '🔊 Ouvir descrição'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.favoriteButton, favorite && styles.favoriteButtonActive]}
          onPress={handleToggleFavorite}
        >
          <Text style={[styles.favoriteButtonText, favorite && styles.favoriteButtonTextActive]}>
            {favorite ? '★ Favorito' : '☆ Salvar favorito'}
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>História & Descrição</Text>
          <Text style={styles.sectionText}>{description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Informações</Text>
          <View style={styles.dataBox}>
            <Text style={styles.dataBoxText}>{stats}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Curiosidade</Text>
          <Text style={styles.curiosityText}>{curiosity}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  imageFrame: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#D4AF37',
    height: 260,
    backgroundColor: theme.colors.surface,
  },
  imageWrap: { flex: 1 },
  image: { width: '100%', height: '100%' },
  content: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: theme.colors.background,
    marginTop: -16,
  },
  typeTag: { fontSize: 11, fontWeight: 'bold', color: theme.colors.primary, letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginTop: 4 },
  subtitle: { fontSize: 16, color: theme.colors.textLight, marginBottom: 16 },
  audioButton: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  audioButtonActive: { backgroundColor: theme.colors.text },
  audioButtonText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  audioButtonTextActive: { color: '#FFF' },
  favoriteButton: {
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  favoriteButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  favoriteButtonText: { color: theme.colors.text, fontWeight: '600', fontSize: 14 },
  favoriteButtonTextActive: { color: '#FFF' },
  section: {
    marginBottom: 24,
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  sectionText: { fontSize: 15, color: theme.colors.textLight, lineHeight: 22 },
  dataBox: { backgroundColor: theme.colors.background, padding: 12, borderRadius: 8, marginTop: 4 },
  dataBoxText: { color: theme.colors.primary, fontWeight: 'bold', textAlign: 'center' },
  curiosityText: { fontSize: 14, color: theme.colors.textLight, fontStyle: 'italic', lineHeight: 20 },
});
