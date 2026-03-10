import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const ChoreCard = ({ title, assigneeName, status, dueDate, onComplete }) => {
  const isPending = status === 'pending';
  const dateLabel = dueDate
    ? new Date(dueDate.seconds ? dueDate.seconds * 1000 : dueDate).toLocaleDateString()
    : 'No due date';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.leftRow}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={isPending ? 'time-outline' : 'checkmark-done-outline'}
              size={18}
              color={isPending ? colors.warning : colors.success}
            />
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.meta}>
              Assigned to {assigneeName} • {dateLabel}
            </Text>
          </View>
        </View>
        {isPending && onComplete && (
          <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
            <Text style={styles.completeButtonText}>Mark done</Text>
          </TouchableOpacity>
        )}
      </View>
      {!isPending && <Text style={styles.completedLabel}>Completed</Text>}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
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
  completeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.success,
  },
  completeButtonText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  completedLabel: {
    marginTop: 6,
    fontSize: 11,
    color: colors.success,
    fontWeight: '500',
  },
});

export default ChoreCard;

