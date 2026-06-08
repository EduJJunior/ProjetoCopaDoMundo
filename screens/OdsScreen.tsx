import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader, { ScreenContainer } from '../components/ui/ScreenHeader';
import ThemeToggle from '../components/ui/ThemeToggle';
import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

const odsIcons: Array<keyof typeof Ionicons.glyphMap> = [
  'school',
  'briefcase',
  'construct',
  'people',
  'globe',
];

export default function OdsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const odsList = [
    {
      title: 'ODS 4 – Educação de Qualidade',
      desc: 'Conteúdo histórico e cultural sobre as Copas, aprendendo geografia, estatísticas e curiosidades de cada país-sede.',
    },
    {
      title: 'ODS 8 – Trabalho Decente e Crescimento Econômico',
      desc: 'Explora como eventos esportivos movimentam empregos, infraestrutura, turismo e economia local de diferentes países.',
    },
    {
      title: 'ODS 9 – Indústria, Inovação e Infraestrutura',
      desc: 'Demonstra o uso de tecnologia móvel, design interativo e experiências digitais no desenvolvimento de um álbum colecionável.',
    },
    {
      title: 'ODS 10 – Redução das Desigualdades',
      desc: 'Promove inclusão com funcionalidades de acessibilidade e uma interface que facilita o acesso de usuários diversos.',
    },
    {
      title: 'ODS 17 – Parcerias e Meios de Implementação',
      desc: 'Mostra como o esporte e a educação podem aproximar culturas, nações e comunidades por meio de parcerias globais.',
    },
  ];

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="Sustentabilidade & Impacto"
          subtitle="Conexão com as Metas Globais da ONU (ODS)"
          emoji="🌍"
          rightAction={<ThemeToggle />}
        />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {odsList.map((ods, idx) => (
            <Card key={idx} style={styles.odsCard}>
              <View style={styles.odsHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name={odsIcons[idx]} size={22} color={theme.colors.textInverse} />
                </View>
                <Text style={styles.odsTitle}>{ods.title}</Text>
              </View>
              <Text style={styles.odsDesc}>{ods.desc}</Text>
            </Card>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 16, paddingBottom: 32 },
    odsCard: { marginBottom: 14 },
    odsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    odsTitle: {
      flex: 1,
      fontSize: 15,
      fontFamily: theme.typography.fontBold,
      color: theme.colors.text,
      lineHeight: 22,
    },
    odsDesc: {
      fontSize: 14,
      fontFamily: theme.typography.fontRegular,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
  });
}
