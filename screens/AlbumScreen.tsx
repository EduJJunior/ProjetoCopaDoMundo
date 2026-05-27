import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { albumData, CardItem } from '../data/mockData';
import { theme } from '../styles/theme';

export default function AlbumScreen({ navigation }: any) {
  const [filter, setFilter] = useState<'all' | 'team' | 'player' | 'stadium'>('all');

  const filteredData = filter === 'all' ? albumData : albumData.filter(item => item.type === filter);

  const renderCard = ({ item }: { item: CardItem }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Details', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTag}>{item.type.toUpperCase()}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Álbum Digital</Text>
        <Text style={styles.headerSubtitle}>Explore figurinhas, seleções e estádios</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        {(['all', 'team', 'player', 'stadium'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filter === type && styles.filterButtonActive]}
            onPress={() => setFilter(type)}
          >
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
              {type === 'all' ? 'Todos' : type === 'team' ? 'Seleções' : type === 'player' ? 'Craques' : 'Estádios'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 20, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderColor: theme.colors.border },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: theme.colors.primary },
  headerSubtitle: { fontSize: 14, color: theme.colors.textLight, marginTop: 4 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 16, marginVertical: 12, justifyContent: 'space-between' },
  filterButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  filterButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterText: { fontSize: 12, color: theme.colors.textLight, fontWeight: '600' },
  filterTextActive: { color: theme.colors.surface },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  cardContent: { padding: 16 },
  cardTag: { fontSize: 10, fontWeight: 'bold', color: theme.colors.secondary, marginBottom: 4, letterSpacing: 1 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
  cardSubtitle: { fontSize: 14, color: theme.colors.textLight, marginTop: 2 }
});