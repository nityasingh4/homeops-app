import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

const CreateHomeScreen = ({ navigation }) => {
  const { createHome, loadingAction, home, error, userProfile } = useAppContext();
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    if (!userProfile) {
      return; // still loading profile
    }
    try {
      await createHome(name.trim());
      navigation.replace('InviteRoommates');
    } catch (err) {
      // error is set in context; show it below
    }
  };

  if (home) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeTabs' }],
    });
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Name your home</Text>
          <Text style={styles.subtitle}>
            Create a shared space for you and your roommates.
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Home name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Maple Street House"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (loadingAction || !userProfile) && styles.primaryButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={loadingAction || !userProfile}
          >
            <Text style={styles.primaryButtonText}>
              {!userProfile
                ? 'Loading…'
                : loadingAction
                  ? 'Creating…'
                  : 'Create home'}
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    marginBottom: 12,
  },
  inputGroup: {
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
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#111827',
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

export default CreateHomeScreen;

