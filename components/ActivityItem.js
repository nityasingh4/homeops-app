import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const iconForType = (type) => {
  switch (type) {
    case 'expense_added':
      return 'card-outline';
    case 'chore_completed':
      return 'checkmark-done-outline';
    case 'roommate_invited':
      return 'person-add-outline';
    default:
      return 'ellipse-outline';
  }
};

const ActivityItem = ({ type, title, timestamp, by }) => {
  const icon = iconForType(type);
  const dateLabel = timestamp
    ? new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp).toLocaleString()
    : '';

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {by ? `${by} • ` : ''}
          {dateLabel}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  meta: {
    fontSize: 11,
    color: colors.textMuted,
  },
});

export default ActivityItem;

