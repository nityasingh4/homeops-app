import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';

const JoinHomeScreen = ({ navigation }) => {
  const { pendingInviteForUser, acceptInvite, loadingAction, userProfile } = useAppContext();

  if (!pendingInviteForUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>No home invite found</Text>
          <Text style={styles.subtitle}>
            You can create a new home to get started.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.replace('CreateHome')}
          >
            <Text style={styles.primaryButtonText}>Create a home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.caption}>Home invitation</Text>
        <Text style={styles.title}>Join your roommates</Text>
        <Text style={styles.subtitle}>
          {pendingInviteForUser.email} has been invited to join this home. Accept to see shared
          expenses and chores.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Invited email</Text>
          <Text style={styles.infoValue}>{pendingInviteForUser.email}</Text>
          <Text style={[styles.infoLabel, { marginTop: 12 }]}>Signed in as</Text>
          <Text style={styles.infoValue}>{userProfile?.email}</Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, loadingAction && styles.primaryButtonDisabled]}
          onPress={acceptInvite}
          disabled={loadingAction}
        >
          <Text style={styles.primaryButtonText}>
            {loadingAction ? 'Joining…' : 'Accept invite'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JoinHomeScreen;

