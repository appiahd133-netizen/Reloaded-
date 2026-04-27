import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TradeContext = createContext();

export function TradeProvider({ children }) {
  const [trades, setTrades] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedTrades = await AsyncStorage.getItem('trades');
      const savedTheme = await AsyncStorage.getItem('isDark');
      if (savedTrades) setTrades(JSON.parse(savedTrades));
      if (savedTheme !== null) setIsDark(JSON.parse(savedTheme));
    } catch (e) {}
    setLoading(false);
  };

  const saveTrades = async (newTrades) => {
    await AsyncStorage.setItem('trades', JSON.stringify(newTrades));
    setTrades(newTrades);
  };

  const addTrade = async (trade) => {
    const newTrade = { ...trade, id: Date.now().toString(), date: new Date().toISOString() };
    const newTrades = [newTrade, ...trades];
    await saveTrades(newTrades);
  };

  const deleteTrade = async (id) => {
    const newTrades = trades.filter(t => t.id !== id);
    await saveTrades(newTrades);
  };

  const toggleTheme = async () => {
    const newVal = !isDark;
    setIsDark(newVal);
    await AsyncStorage.setItem('isDark', JSON.stringify(newVal));
  };

  const getStats = () => {
    if (!trades.length) return { totalPnL: 0, winRate: 0, totalTrades: 0, avgWin: 0, avgLoss: 0, bestTrade: 0, worstTrade: 0 };
    const pnls = trades.map(t => parseFloat(t.pnl) || 0);
    const wins = pnls.filter(p => p > 0);
    const losses = pnls.filter(p => p < 0);
    return {
      totalPnL: pnls.reduce((a, b) => a + b, 0),
      winRate: trades.length ? (wins.length / trades.length) * 100 : 0,
      totalTrades: trades.length,
      avgWin: wins.length ? wins.reduce((a, b) => a + b, 0) / wins.length : 0,
      avgLoss: losses.length ? losses.reduce((a, b) => a + b, 0) / losses.length : 0,
      bestTrade: pnls.length ? Math.max(...pnls) : 0,
      worstTrade: pnls.length ? Math.min(...pnls) : 0,
    };
  };

  return (
    <TradeContext.Provider value={{ trades, addTrade, deleteTrade, isDark, toggleTheme, loading, getStats }}>
      {children}
    </TradeContext.Provider>
  );
}

export const useTrades = () => useContext(TradeContext);
