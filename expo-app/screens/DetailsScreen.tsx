import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../styles/theme';

export default function DetailsScreen({ route }: any) {
  const { item } = route.params;
  const [favorite, setFavorite] = useState(false);

  const title = item.title ?? item.nome;
  const subtitle = item.subtitle ?? `${item.selecao} • ${item.posicao}`;
  const description = item.description ?? `Figurinha da seleção ${item.selecao}. ${item.curiosidade}`;
  const stats = item.stats ?? item.posicao;
  const curiosity = item.curiosity ?? item.curiosidade;
  const typeLabel = item.type ? item.type.toUpperCase() : item.posicao;

  const handleAccessibilitySpeech = () => {
    Alert.alert('Acessibilidade (Screen Reader)', `Lendo: ${title}. ${description}`);
  };

  const handleToggleFavorite = () => {
    setFavorite((prev) => !prev);
    Alert.alert(
      favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      favorite ? 'Este item não faz mais parte dos seus favoritos.' : 'Este item agora está salvo nos seus favoritos.'
    );
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <Image source={item.image} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.typeTag}>{typeLabel}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <TouchableOpacity style={styles.audioButton} onPress={handleAccessibilitySpeech}>
          <Text style={styles.audioButtonText}>🔊 Ouvir descrição</Text>
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
  image: { width: '100%', height: 260 },
  content: { padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: theme.colors.background, marginTop: -24 },
  typeTag: { fontSize: 11, fontWeight: 'bold', color: theme.colors.primary, letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginTop: 4 },
  subtitle: { fontSize: 16, color: theme.colors.textLight, marginBottom: 16 },
  audioButton: { backgroundColor: theme.colors.border, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  audioButtonText: { color: theme.colors.text, fontWeight: '600', fontSize: 14 },
  favoriteButton: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, marginBottom: 20 },
  favoriteButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  favoriteButtonText: { color: theme.colors.text, fontWeight: '600', fontSize: 14 },
  favoriteButtonTextActive: { color: '#FFF' },
  section: { marginBottom: 24, backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  sectionText: { fontSize: 15, color: theme.colors.textLight, lineHeight: 22 },
  dataBox: { backgroundColor: theme.colors.background, padding: 12, borderRadius: 8, marginTop: 4 },
  dataBoxText: { color: theme.colors.primary, fontWeight: 'bold', textAlign: 'center' },
  curiosityText: { fontSize: 14, color: theme.colors.textLight, fontStyle: 'italic', lineHeight: 20 }
});