import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../styles/theme';

export default function OdsScreen() {
  const odsList = [
    { title: 'ODS 4 – Educação de Qualidade', desc: 'Disseminação gratuita de fatos históricos, geografia cultural dos países-sede e dados estatísticos precisos.' },
    { title: 'ODS 8 – Trabalho Decente e Crescimento Econômico', desc: 'Fomento do entendimento do impacto econômico global gerado pelo turismo e marketing esportivo.' },
    { title: 'ODS 9 – Indústria, Inovação e Infraestrutura', desc: 'Uso de arquitetura mobile moderna com foco em performance e transformação digital do colecionável.' },
    { title: 'ODS 10 – Redução das Desigualdades', desc: 'Recursos integrados de acessibilidade para que pessoas com limitações visuais/motoras acessem o ecossistema.' }
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