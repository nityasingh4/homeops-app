import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RoommateCard = ({ name, subtitle, compact = false }) => {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(name || '?').slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardCompact: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default RoommateCard;

