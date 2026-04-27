import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTrades } from '../context/TradeContext';
import { darkTheme, lightTheme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { isDark, toggleTheme, trades } = useTrades();
  const t = isDark ? darkTheme : lightTheme;

  const exportCSV = () => {
    if (trades.length === 0) return Alert.alert('No trades', 'Add some trades first.');
    const header = 'Date,Pair,Direction,Entry,Exit,Lots,P&L,Outcome,Notes';
    const rows = trades.map(tr =>
      `${new Date(tr.date).toLocaleDateString()},${tr.pair},${tr.direction},${tr.entry},${tr.exit},${tr.lots},${tr.pnl},${tr.outcome},"${tr.notes}"`
    );
    Alert.alert('CSV Export', 'CSV content:\n\n' + header + '\n' + rows.slice(0, 3).join('\n') + (rows.length > 3 ? '\n...' : ''));
  };

  const clearData = () => {
    Alert.alert('Clear All Data', 'This will delete ALL your trades. This cannot be undone!', [
      { text: 'Cancel' },
      { text: 'Delete All', style: 'destructive', onPress: async () => {
        await AsyncStorage.removeItem('trades');
        Alert.alert('Done', 'All trades deleted.');
      }}
    ]);
  };

  const Row = ({ emoji, label, onPress, right }) => (
    <TouchableOpacity onPress={onPress} style={[styles.row, { backgroundColor: t.card, borderColor: t.border }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.rowLabel, { color: t.text }]}>{label}</Text>
      {right || <Text style={{ color: t.textSecondary }}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.text }]}>Settings</Text>
      </View>

      <Text style={[styles.section, { color: t.textSecondary }]}>APPEARANCE</Text>
      <Row emoji="🌙" label="Dark Mode" right={<Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: t.primary }} />} />

      <Text style={[styles.section, { color: t.textSecondary }]}>DATA</Text>
      <Row emoji="📤" label="Export to CSV" onPress={exportCSV} />
      <Row emoji="🗑" label="Clear All Trades" onPress={clearData} />

      <Text style={[styles.section, { color: t.textSecondary }]}>ABOUT</Text>
      <View style={[styles.row, { backgroundColor: t.card, borderColor: t.border }]}>
        <Text style={styles.emoji}>📱</Text>
        <Text style={[styles.rowLabel, { color: t.text }]}>Forex Journal</Text>
        <Text style={{ color: t.textSecondary }}>v1.0.0</Text>
      </View>
      <View style={[styles.row, { backgroundColor: t.card, borderColor: t.border }]}>
        <Text style={styles.emoji}>📊</Text>
        <Text style={[styles.rowLabel, { color: t.text }]}>Total Trades Logged</Text>
        <Text style={{ color: t.primary, fontWeight: '700' }}>{trades.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800' },
  section: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  row: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginBottom: 2, padding: 16, borderRadius: 12, borderWidth: 1 },
  emoji: { fontSize: 20, marginRight: 12 },
  rowLabel: { flex: 1, fontSize: 16 },
});
