import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import StickerImage from '../components/StickerImage';
import { resolveImageSource } from '../utils/stickerImage';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { AppTheme } from '../styles/theme';
import { getTypeLabel } from '../utils/albumPages';

export default function DetailsScreen({ route }: any) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { isFavorite, toggleFavorite } = useFavorites();

  const { item } = route.params;
  const favorite = isFavorite(item.id);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const title = item.title ?? item.nome;
  const subtitle = item.subtitle ?? `${item.selecao} • ${item.posicao}`;
  const description = item.description ?? `Figurinha da seleção ${item.selecao}. ${item.curiosidade}`;
  const stats = item.stats ?? item.posicao;
  const curiosity = item.curiosity ?? item.curiosidade;
  const typeLabel = getTypeLabel(item.type, true);

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

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        style={styles.heroGradient}
      >
        <View style={styles.imageFrame}>
          <StickerImage item={item} source={imageSource} style={styles.imageWrap} imageStyle={styles.image} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeTag}>{typeLabel}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <Button
          label={isSpeaking ? 'Parar leitura' : 'Ouvir descrição'}
          icon={isSpeaking ? 'stop-circle' : 'volume-high'}
          variant={isSpeaking ? 'secondary' : 'primary'}
          onPress={handleAccessibilitySpeech}
          fullWidth
          style={styles.actionBtn}
        />

        <Button
          label={favorite ? 'Favorito' : 'Salvar favorito'}
          icon={favorite ? 'star' : 'star-outline'}
          variant={favorite ? 'gold' : 'outline'}
          onPress={() => toggleFavorite(item.id)}
          fullWidth
          style={styles.actionBtn}
        />

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>História & Descrição</Text>
          <Text style={styles.sectionText}>{description}</Text>
        </Card>

        <Card style={styles.section} accent>
          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={styles.dataBox}>
            <Text style={styles.dataBoxText}>{stats}</Text>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Curiosidade</Text>
          <Text style={styles.curiosityText}>{curiosity}</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    heroGradient: {
      paddingTop: 8,
      paddingBottom: 24,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },
    imageFrame: {
      marginHorizontal: 20,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: theme.colors.secondary,
      height: 260,
      backgroundColor: theme.colors.surface,
      ...theme.shadows.md,
    },
    imageWrap: { flex: 1 },
    image: { width: '100%', height: '100%' },
    content: {
      padding: 20,
      marginTop: -12,
    },
    typeBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      marginBottom: 8,
    },
    typeTag: {
      fontSize: 11,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.textInverse,
      letterSpacing: 1,
    },
    title: {
      fontSize: 28,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      marginBottom: 20,
      marginTop: 4,
    },
    actionBtn: { marginBottom: 12 },
    section: { marginBottom: 16 },
    sectionTitle: {
      fontSize: 16,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
      marginBottom: 10,
    },
    sectionText: {
      fontSize: 15,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
    dataBox: {
      backgroundColor: theme.colors.backgroundAlt,
      padding: 14,
      borderRadius: 12,
    },
    dataBoxText: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontBold,
      textAlign: 'center',
      fontSize: 15,
    },
    curiosityText: {
      fontSize: 14,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      lineHeight: 22,
    },
  });
}
