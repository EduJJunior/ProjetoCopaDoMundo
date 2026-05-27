import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../styles/theme';

export default function DetailsScreen({ route, navigation }: any) {
  const { item } = route.params;

  const handleAccessibilitySpeech = () => {
    Alert.alert("Acessibilidade (Screen Reader)", `Lendo: ${item.title}. ${item.description}`);
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.typeTag}>{item.type.toUpperCase()}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        
        {/* Botão de Acessibilidade */}
        <TouchableOpacity style={styles.audioButton} onPress={handleAccessibilitySpeech}>
          <Text style={styles.audioButtonText}>🔊 Ouvir Descrição (Acessibilidade)</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>História & Descrição</Text>
          <Text style={styles.sectionText}>{item.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Estatísticas</Text>
          <View style={styles.dataBox}>
            <Text style={styles.dataBoxText}>{item.stats}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Curiosidade Histórica</Text>
          <Text style={styles.curiosityText}>{item.curiosity}</Text>
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
  audioButton: { backgroundColor: theme.colors.border, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  audioButtonText: { color: theme.colors.text, fontWeight: '600', fontSize: 14 },
  section: { marginBottom: 24, backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  sectionText: { fontSize: 15, color: theme.colors.textLight, lineHeight: 22 },
  dataBox: { backgroundColor: theme.colors.background, padding: 12, borderRadius: 8, marginTop: 4 },
  dataBoxText: { color: theme.colors.primary, fontWeight: 'bold', textAlign: 'center' },
  curiosityText: { fontSize: 14, color: theme.colors.textLight, fontStyle: 'italic', lineHeight: 20 }
});