import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { darkTheme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

const slides = [
  { emoji: '📈', title: 'Track Every Trade', desc: 'Log your forex trades with entry, exit, and profit/loss details in seconds.' },
  { emoji: '📊', title: 'Analyze Performance', desc: 'View your equity curve, win rate, and key metrics to improve your trading.' },
  { emoji: '🗓️', title: 'Heat Calendar', desc: 'See your profit and loss by day on a color-coded calendar heatmap.' },
  { emoji: '🚀', title: 'Become Consistent', desc: 'Build discipline and track your journey to trading mastery.' },
];

export default function OnboardingScreen({ onDone }) {
  const [index, setIndex] = useState(0);
  const t = darkTheme;

  const next = () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else onDone();
  };

  return (
    <LinearGradient colors={['#0A0E1A', '#141824']} style={styles.container}>
      <View style={styles.skip}>
        <TouchableOpacity onPress={onDone}>
          <Text style={[styles.skipText, { color: t.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slide}>
        <Text style={styles.emoji}>{slides[index].emoji}</Text>
        <Text style={[styles.title, { color: t.text }]}>{slides[index].title}</Text>
        <Text style={[styles.desc, { color: t.textSecondary }]}>{slides[index].desc}</Text>
      </View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === index ? t.primary : t.border }]} />
        ))}
      </View>

      <TouchableOpacity onPress={next} style={styles.btn}>
        <LinearGradient colors={['#00D4AA', '#00B894']} style={styles.btnGrad}>
          <Text style={styles.btnText}>{index === slides.length - 1 ? "Let's Go!" : 'Next'}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  skip: { position: 'absolute', top: 60, right: 24 },
  skipText: { fontSize: 16 },
  slide: { alignItems: 'center', paddingHorizontal: 40 },
  emoji: { fontSize: 80, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  desc: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', marginTop: 48, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  btn: { marginTop: 40, width: width - 80, borderRadius: 16, overflow: 'hidden' },
  btnGrad: { paddingVertical: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
