import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useTrades } from '../context/TradeContext';
import { darkTheme, lightTheme } from '../styles/theme';

export default function TradeHistoryScreen() {
  const { trades, deleteTrade, isDark } = useTrades();
  const t = isDark ? darkTheme : lightTheme;
  const [search, setSearch] = useState('');

  const filtered = trades.filter(tr =>
    tr.pair.toLowerCase().includes(search.toLowerCase()) ||
    tr.outcome.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = (id) => {
    Alert.alert('Delete Trade', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTrade(id) }
    ]);
  };

  const renderItem = ({ item }) => {
    const pnl = parseFloat(item.pnl);
    return (
      <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
        <View style={[styles.dirBadge, { backgroundColor: item.direction === 'BUY' ? '#00D4AA22' : '#FF6B6B22' }]}>
          <Text style={[styles.dirText, { color: item.direction === 'BUY' ? t.profit : t.loss }]}>{item.direction}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={[styles.pair, { color: t.text }]}>{item.pair}</Text>
            <Text style={[styles.pnl, { color: pnl >= 0 ? t.profit : t.loss }]}>
              {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <Text style={[styles.meta, { color: t.textSecondary }]}>
              {new Date(item.date).toLocaleDateString()} • {item.outcome}
              {item.lots ? ` • ${item.lots} lots` : ''}
            </Text>
            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Text style={{ color: t.loss, fontSize: 18 }}>🗑</Text>
            </TouchableOpacity>
          </View>
          {item.notes ? <Text style={[styles.notes, { color: t.textMuted }]} numberOfLines={1}>{item.notes}</Text> : null}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.text }]}>Trade History</Text>
        <TextInput
          style={[styles.search, { backgroundColor: t.card, borderColor: t.border, color: t.text }]}
          value={search} onChangeText={setSearch}
          placeholder="Search pair or outcome..." placeholderTextColor={t.textMuted}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📭</Text>
            <Text style={[styles.emptyText, { color: t.textSecondary }]}>No trades found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 12 },
  search: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15, marginBottom: 8 },
  card: { borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: 'hidden', flexDirection: 'row' },
  dirBadge: { width: 48, alignItems: 'center', justifyContent: 'center' },
  dirText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pair: { fontSize: 17, fontWeight: '700' },
  pnl: { fontSize: 17, fontWeight: '700' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  meta: { fontSize: 12 },
  notes: { fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  empty: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyText: { fontSize: 16 },
});
