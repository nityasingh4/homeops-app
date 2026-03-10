import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import RoommateCard from '../components/RoommateCard';

const InviteRoommatesScreen = ({ navigation }) => {
  const { home, roommateInvites, inviteRoommateByEmail, roommates, loadingAction } =
    useAppContext();
  const [email, setEmail] = useState('');

  const handleInvite = async () => {
    if (!email.trim()) return;
    try {
      await inviteRoommateByEmail(email.trim());
      setEmail('');
    } catch {
    }
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeTabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Invite your roommates</Text>
        <Text style={styles.subtitle}>
          Roommates who sign up with an invited email will automatically join{' '}
          {home?.name || 'your home'}.
        </Text>

        <View style={styles.inputRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Roommate email</Text>
            <TextInput
              style={styles.input}
              placeholder="roommate@example.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <TouchableOpacity
            style={[styles.addButton, loadingAction && styles.addButtonDisabled]}
            onPress={handleInvite}
            disabled={loadingAction}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Current roommates</Text>
        <FlatList
          data={roommates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RoommateCard name={item.displayName || item.email} subtitle={item.email} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>You’re the first member of this home.</Text>
          }
          contentContainerStyle={{ paddingBottom: 8 }}
        />

        <Text style={styles.sectionTitle}>Invited emails</Text>
        <FlatList
          data={roommateInvites}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => <RoommateCard name={item} subtitle="Pending invite" />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No invites yet. Add a roommate to get started.</Text>
          }
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSkip}>
          <Text style={styles.primaryButtonText}>Done, take me to my dashboard</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  primaryButton: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default InviteRoommatesScreen;

