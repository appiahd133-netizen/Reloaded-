import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTrades } from '../context/TradeContext';
import { darkTheme, lightTheme } from '../styles/theme';

const PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'NZD/USD', 'USD/CAD', 'EUR/GBP', 'XAU/USD', 'Other'];
const DIRECTIONS = ['BUY', 'SELL'];
const OUTCOMES = ['Win', 'Loss', 'Breakeven'];

export default function AddTradeScreen({ navigation }) {
  const { addTrade, isDark } = useTrades();
  const t = isDark ? darkTheme : lightTheme;

  const [pair, setPair] = useState('EUR/USD');
  const [direction, setDirection] = useState('BUY');
  const [entry, setEntry] = useState('');
  const [exit, setExit] = useState('');
  const [lots, setLots] = useState('');
  const [pnl, setPnl] = useState('');
  const [outcome, setOutcome] = useState('Win');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!pnl) return Alert.alert('Required', 'Please enter the P&L amount.');
    await addTrade({ pair, direction, entry, exit, lots, pnl, outcome, notes });
    Alert.alert('✅ Trade Saved!', 'Your trade has been logged.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const Label = ({ text }) => <Text style={[styles.label, { color: t.textSecondary }]}>{text}</Text>;

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.text }]}>Log Trade</Text>
      </View>

      <View style={styles.form}>
        {/* Pair */}
        <Label text="Currency Pair" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {PAIRS.map(p => (
            <TouchableOpacity key={p} onPress={() => setPair(p)}
              style={[styles.chip, { backgroundColor: pair === p ? t.primary : t.card, borderColor: pair === p ? t.primary : t.border }]}>
              <Text style={[styles.chipText, { color: pair === p ? '#fff' : t.text }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Direction */}
        <Label text="Direction" />
        <View style={styles.row}>
          {DIRECTIONS.map(d => (
            <TouchableOpacity key={d} onPress={() => setDirection(d)} style={[styles.dirBtn, {
              backgroundColor: direction === d ? (d === 'BUY' ? t.profit : t.loss) : t.card,
              borderColor: direction === d ? (d === 'BUY' ? t.profit : t.loss) : t.border, flex: 1
            }]}>
              <Text style={[styles.dirText, { color: direction === d ? '#fff' : t.text }]}>{d === 'BUY' ? '📈 BUY' : '📉 SELL'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Entry / Exit */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Label text="Entry Price" />
            <TextInput style={[styles.input, { backgroundColor: t.card, borderColor: t.border, color: t.text }]}
              value={entry} onChangeText={setEntry} placeholder="1.0850" placeholderTextColor={t.textMuted} keyboardType="decimal-pad" />
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Label text="Exit Price" />
            <TextInput style={[styles.input, { backgroundColor: t.card, borderColor: t.border, color: t.text }]}
              value={exit} onChangeText={setExit} placeholder="1.0900" placeholderTextColor={t.textMuted} keyboardType="decimal-pad" />
          </View>
        </View>

        {/* Lots / P&L */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Label text="Lot Size" />
            <TextInput style={[styles.input, { backgroundColor: t.card, borderColor: t.border, color: t.text }]}
              value={lots} onChangeText={setLots} placeholder="0.01" placeholderTextColor={t.textMuted} keyboardType="decimal-pad" />
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Label text="P&L ($) *" />
            <TextInput style={[styles.input, { backgroundColor: t.card, borderColor: t.border, color: t.text }]}
              value={pnl} onChangeText={setPnl} placeholder="-25.00" placeholderTextColor={t.textMuted} keyboardType="decimal-pad" />
          </View>
        </View>

        {/* Outcome */}
        <Label text="Outcome" />
        <View style={styles.row}>
          {OUTCOMES.map(o => (
            <TouchableOpacity key={o} onPress={() => setOutcome(o)} style={[styles.outcomeBtn, {
              backgroundColor: outcome === o ? (o === 'Win' ? t.profit : o === 'Loss' ? t.loss : t.neutral) : t.card,
              borderColor: outcome === o ? (o === 'Win' ? t.profit : o === 'Loss' ? t.loss : t.neutral) : t.border, flex: 1
            }]}>
              <Text style={[styles.outcomeText, { color: outcome === o ? '#fff' : t.text }]}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Label text="Notes" />
        <TextInput style={[styles.input, styles.textarea, { backgroundColor: t.card, borderColor: t.border, color: t.text }]}
          value={notes} onChangeText={setNotes} placeholder="Trade notes, emotions, lessons..." placeholderTextColor={t.textMuted}
          multiline numberOfLines={4} textAlignVertical="top" />

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: t.primary }]}>
          <Text style={styles.saveBtnText}>💾 Save Trade</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800' },
  form: { paddingHorizontal: 24 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  chips: { flexDirection: 'row', marginBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  chipText: { fontSize: 13, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8 },
  dirBtn: { padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  dirText: { fontSize: 16, fontWeight: '700' },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  textarea: { height: 100 },
  outcomeBtn: { padding: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  outcomeText: { fontSize: 14, fontWeight: '600' },
  saveBtn: { padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
