import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const categoryIcon = (category) => {
  switch (category) {
    case 'rent':
      return 'home-outline';
    case 'groceries':
      return 'basket-outline';
    case 'utilities':
      return 'flash-outline';
    default:
      return 'pricetag-outline';
  }
};

const ExpenseCard = ({ title, amount, category = 'other', paidBy, createdAt }) => {
  const icon = categoryIcon(category);
  const payerLabel = paidBy?.displayName || paidBy?.email || 'Someone';
  const dateLabel = createdAt
    ? new Date(createdAt.seconds ? createdAt.seconds * 1000 : createdAt).toLocaleDateString()
    : '';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.leftRow}>
          <View style={styles.iconWrapper}>
            <Ionicons name={icon} size={18} color={colors.primaryDark} />
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.meta}>
              {category.toUpperCase()} • paid by {payerLabel}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.amount}>${Number(amount || 0).toFixed(2)}</Text>
          {dateLabel ? <Text style={styles.meta}>{dateLabel}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  meta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default ExpenseCard;

