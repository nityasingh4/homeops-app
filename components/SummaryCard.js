import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const SummaryCard = ({ title, subtitle, value, tone = 'primary' }) => {
  const backgroundColor = tone === 'accent' ? colors.accent : colors.surface;
  const valueColor = tone === 'accent' ? colors.primaryDark : colors.primaryDark;

  return (
    <View style={[styles.card, tone === 'accent' && styles.cardAccent]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {value !== undefined && (
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardAccent: {
    backgroundColor: colors.surfaceSoft,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
  },
});

export default SummaryCard;

