import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTrades } from '../context/TradeContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { trades, isDark, getStats } = useTrades();
  const t = isDark ? darkTheme : lightTheme;
  const stats = getStats();

  const equityData = () => {
    if (trades.length === 0) return [0];
    let running = 0;
    return [...trades].reverse().map(tr => {
      running += parseFloat(tr.pnl) || 0;
      return running;
    });
  };

  const data = equityData();

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: t.textSecondary }]}>Good day, Trader 👋</Text>
        <Text style={[styles.title, { color: t.text }]}>Dashboard</Text>
      </View>

      {/* Total P&L */}
      <View style={[styles.pnlCard, { backgroundColor: stats.totalPnL >= 0 ? '#00D4AA22' : '#FF6B6B22', borderColor: stats.totalPnL >= 0 ? t.profit : t.loss }]}>
        <Text style={[styles.pnlLabel, { color: t.textSecondary }]}>Total P&L</Text>
        <Text style={[styles.pnlValue, { color: stats.totalPnL >= 0 ? t.profit : t.loss }]}>
          {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.grid}>
        {[
          { label: 'Win Rate', value: `${stats.winRate.toFixed(1)}%`, color: t.primary },
          { label: 'Total Trades', value: stats.totalTrades, color: t.secondary },
          { label: 'Best Trade', value: `$${stats.bestTrade.toFixed(2)}`, color: t.profit },
          { label: 'Worst Trade', value: `$${stats.worstTrade.toFixed(2)}`, color: t.loss },
          { label: 'Avg Win', value: `$${stats.avgWin.toFixed(2)}`, color: t.profit },
          { label: 'Avg Loss', value: `$${stats.avgLoss.toFixed(2)}`, color: t.loss },
        ].map((item, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: t.card, borderColor: t.border }]}>
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
            <Text style={[styles.statLabel, { color: t.textSecondary }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Equity Curve */}
      {trades.length > 1 && (
        <View style={[styles.chartCard, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Equity Curve</Text>
          <LineChart
            data={{ labels: [], datasets: [{ data }] }}
            width={width - 48}
            height={180}
            chartConfig={{
              backgroundColor: t.card,
              backgroundGradientFrom: t.card,
              backgroundGradientTo: t.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 212, 170, ${opacity})`,
              labelColor: () => t.textSecondary,
              propsForDots: { r: '3', strokeWidth: '1', stroke: '#00D4AA' },
            }}
            bezier
            style={{ borderRadius: 12, marginTop: 8 }}
            withDots={data.length < 20}
            withInnerLines={false}
          />
        </View>
      )}

      {/* Recent Trades */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: t.text }]}>Recent Trades</Text>
        {trades.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: t.card, borderColor: t.border }]}>
            <Text style={{ fontSize: 40 }}>📝</Text>
            <Text style={[styles.emptyText, { color: t.textSecondary }]}>No trades yet. Add your first trade!</Text>
          </View>
        ) : (
          trades.slice(0, 5).map(trade => (
            <View key={trade.id} style={[styles.tradeRow, { backgroundColor: t.card, borderColor: t.border }]}>
              <View>
                <Text style={[styles.tradePair, { color: t.text }]}>{trade.pair}</Text>
                <Text style={[styles.tradeDate, { color: t.textSecondary }]}>{new Date(trade.date).toLocaleDateString()}</Text>
              </View>
              <Text style={[styles.tradePnL, { color: parseFloat(trade.pnl) >= 0 ? t.profit : t.loss }]}>
                {parseFloat(trade.pnl) >= 0 ? '+' : ''}${parseFloat(trade.pnl).toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  greeting: { fontSize: 14 },
  title: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  pnlCard: { marginHorizontal: 24, padding: 24, borderRadius: 16, borderWidth: 1, marginBottom: 16, alignItems: 'center' },
  pnlLabel: { fontSize: 14, marginBottom: 4 },
  pnlValue: { fontSize: 36, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  statCard: { width: (width - 48) / 2 - 4, padding: 16, borderRadius: 12, borderWidth: 1 },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
  chartCard: { marginHorizontal: 24, padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  section: { paddingHorizontal: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  empty: { padding: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 8 },
  emptyText: { textAlign: 'center', fontSize: 14 },
  tradeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  tradePair: { fontSize: 16, fontWeight: '600' },
  tradeDate: { fontSize: 12, marginTop: 2 },
  tradePnL: { fontSize: 18, fontWeight: '700' },
});
