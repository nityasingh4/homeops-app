import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const QuickActionCard = ({ label, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={20} color={colors.primaryDark} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginHorizontal: 4,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default QuickActionCard;

