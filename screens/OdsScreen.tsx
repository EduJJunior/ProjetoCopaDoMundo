import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../styles/theme';

export default function OdsScreen() {
  const odsList = [
    { title: 'ODS 4 – Educação de Qualidade', desc: 'Conteúdo histórico e cultural sobre as Copas, aprendendo geografia, estatísticas e curiosidades de cada país-sede.' },
    { title: 'ODS 8 – Trabalho Decente e Crescimento Econômico', desc: 'Explora como eventos esportivos movimentam empregos, infraestrutura, turismo e economia local de diferentes países.' },
    { title: 'ODS 9 – Indústria, Inovação e Infraestrutura', desc: 'Demonstra o uso de tecnologia móvel, design interativo e experiências digitais no desenvolvimento de um álbum colecionável.' },
    { title: 'ODS 10 – Redução das Desigualdades', desc: 'Promove inclusão com funcionalidades de acessibilidade e uma interface que facilita o acesso de usuários diversos.' },
    { title: 'ODS 17 – Parcerias e Meios de Implementação', desc: 'Mostra como o esporte e a educação podem aproximar culturas, nações e comunidades por meio de parcerias globais.' }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Sustentabilidade & Impacto</Text>
        <Text style={styles.subtitle}>Como nosso App se conecta com as Metas Globais da ONU (ODS)</Text>
        
        {odsList.map((ods, idx) => (
          <View key={idx} style={styles.odsCard}>
            <Text style={styles.odsTitle}>{ods.title}</Text>
            <Text style={styles.odsDesc}>{ods.desc}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
  subtitle: { fontSize: 14, color: theme.colors.textLight, marginBottom: 20, marginTop: 4 },
  odsCard: { backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border },
  odsTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 6 },
  odsDesc: { fontSize: 14, color: theme.colors.textLight, lineHeight: 20 }
});