import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTrades } from '../context/TradeContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { trades, isDark, getStats } = useTrades();
  const t = isDark ? darkTheme : lightTheme;
  const stats = getStats();

  // Equity curve
  const equityPoints = () => {
    if (trades.length < 2) return [0, 0];
    let running = 0;
    return [...trades].reverse().map(tr => {
      running += parseFloat(tr.pnl) || 0;
      return parseFloat(running.toFixed(2));
    });
  };

  // Heat calendar - last 35 days
  const buildHeatMap = () => {
    const days = [];
    const today = new Date();
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toDateString();
      const dayTrades = trades.filter(tr => new Date(tr.date).toDateString() === dateStr);
      const dayPnl = dayTrades.reduce((sum, tr) => sum + (parseFloat(tr.pnl) || 0), 0);
      days.push({ date: d, pnl: dayPnl, count: dayTrades.length });
    }
    return days;
  };

  const heatDays = buildHeatMap();
  const cellSize = (width - 64) / 7;

  const getCellColor = (pnl, count) => {
    if (count === 0) return t.border;
    if (pnl > 50) return '#00D4AA';
    if (pnl > 0) return '#00D4AA88';
    if (pnl < -50) return '#FF6B6B';
    if (pnl < 0) return '#FF6B6B88';
    return t.neutral;
  };

  // Pair performance
  const pairStats = () => {
    const map = {};
    trades.forEach(tr => {
      if (!map[tr.pair]) map[tr.pair] = { pnl: 0, count: 0 };
      map[tr.pair].pnl += parseFloat(tr.pnl) || 0;
      map[tr.pair].count++;
    });
    return Object.entries(map).sort((a, b) => b[1].pnl - a[1].pnl).slice(0, 5);
  };

  const pairs = pairStats();

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.text }]}>Analytics</Text>
      </View>

      {/* Equity Curve */}
      <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
        <Text style={[styles.cardTitle, { color: t.text }]}>📈 Equity Curve</Text>
        {trades.length > 1 ? (
          <LineChart
            data={{ labels: [], datasets: [{ data: equityPoints() }] }}
            width={width - 80}
            height={200}
            chartConfig={{
              backgroundColor: t.card,
              backgroundGradientFrom: t.card,
              backgroundGradientTo: t.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 212, 170, ${opacity})`,
              labelColor: () => t.textSecondary,
            }}
            bezier
            withDots={false}
            withInnerLines={false}
            style={{ borderRadius: 8, marginTop: 8 }}
          />
        ) : (
          <Text style={[styles.noData, { color: t.textSecondary }]}>Add at least 2 trades to see equity curve</Text>
        )}
      </View>

      {/* Heat Calendar */}
      <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
        <Text style={[styles.cardTitle, { color: t.text }]}>🗓 P&L Heat Calendar</Text>
        <View style={styles.legend}>
          {[['Loss', t.loss], ['Breakeven', t.neutral], ['Profit', t.profit]].map(([label, color]) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={[styles.legendText, { color: t.textSecondary }]}>{label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.weekdays}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <Text key={i} style={[styles.weekday, { color: t.textSecondary, width: cellSize }]}>{d}</Text>
          ))}
        </View>
        <View style={styles.heatGrid}>
          {heatDays.map((day, i) => (
            <View key={i} style={[styles.heatCell, { width: cellSize - 4, height: cellSize - 4, backgroundColor: getCellColor(day.pnl, day.count), borderRadius: 4 }]} />
          ))}
        </View>
      </View>

      {/* Top Pairs */}
      {pairs.length > 0 && (
        <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={[styles.cardTitle, { color: t.text }]}>💹 Top Pairs</Text>
          {pairs.map(([pair, data]) => (
            <View key={pair} style={styles.pairRow}>
              <Text style={[styles.pairName, { color: t.text }]}>{pair}</Text>
              <Text style={[styles.pairCount, { color: t.textSecondary }]}>{data.count} trades</Text>
              <Text style={[styles.pairPnl, { color: data.pnl >= 0 ? t.profit : t.loss }]}>
                {data.pnl >= 0 ? '+' : ''}${data.pnl.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Win/Loss Stats */}
      <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
        <Text style={[styles.cardTitle, { color: t.text }]}>📊 Performance</Text>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: t.textSecondary }]}>Win Rate</Text>
          <Text style={[styles.statVal, { color: t.primary }]}>{stats.winRate.toFixed(1)}%</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: t.border }]}>
          <View style={[styles.progressFill, { width: `${stats.winRate}%`, backgroundColor: t.profit }]} />
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: t.textSecondary }]}>Avg Win</Text>
          <Text style={[styles.statVal, { color: t.profit }]}>${stats.avgWin.toFixed(2)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: t.textSecondary }]}>Avg Loss</Text>
          <Text style={[styles.statVal, { color: t.loss }]}>${Math.abs(stats.avgLoss).toFixed(2)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: t.textSecondary }]}>Risk/Reward</Text>
          <Text style={[styles.statVal, { color: t.secondary }]}>
            {stats.avgLoss !== 0 ? `1:${(stats.avgWin / Math.abs(stats.avgLoss)).toFixed(2)}` : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800' },
  card: { marginHorizontal: 24, marginBottom: 16, padding: 16, borderRadius: 16, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  noData: { textAlign: 'center', padding: 20, fontSize: 14 },
  legend: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12 },
  weekdays: { flexDirection: 'row', marginBottom: 4 },
  weekday: { textAlign: 'center', fontSize: 11, fontWeight: '600' },
  heatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  heatCell: {},
  pairRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#2A3045' },
  pairName: { flex: 1, fontSize: 15, fontWeight: '600' },
  pairCount: { fontSize: 12, marginRight: 12 },
  pairPnl: { fontSize: 15, fontWeight: '700', minWidth: 70, textAlign: 'right' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  statLabel: { fontSize: 14 },
  statVal: { fontSize: 14, fontWeight: '700' },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
});
