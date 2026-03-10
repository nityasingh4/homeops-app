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
import { colors } from '../theme/colors';

const AddExpenseScreen = ({ navigation }) => {
  const { addExpense, loadingAction, roommates, user } = useAppContext();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [payerId, setPayerId] = useState(null);

  const handleSave = async () => {
    if (!title || !amount) return;
    const paidBy = payerId || user?.uid;
    try {
      await addExpense({ title, amount, category, paidBy });
      navigation.goBack();
    } catch {
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>New expense</Text>
          <Text style={styles.subtitle}>Stored for your entire home.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Internet bill"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 90"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pillRow}>
              {['rent', 'groceries', 'utilities', 'other'].map((cat) => {
                const isActive = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.pill, isActive && styles.pillActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Who paid?</Text>
            <View style={styles.pillRow}>
              {[{ id: user?.uid, label: 'Me' }, ...roommates].map((r, index) => {
                const id = index === 0 ? r.id : r.id;
                const display =
                  index === 0
                    ? 'Me'
                    : r.displayName || r.email || 'Roommate';
                const isActive = payerId ? payerId === id : index === 0;
                return (
                  <TouchableOpacity
                    key={`${id}-${display}`}
                    style={[styles.pill, isActive && styles.pillActive]}
                    onPress={() => setPayerId(id)}
                  >
                    <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                      {display}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loadingAction && styles.primaryButtonDisabled]}
            onPress={handleSave}
            disabled={loadingAction}
          >
            <Text style={styles.primaryButtonText}>
              {loadingAction ? 'Saving…' : 'Save expense'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: '#F9FAFB',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  primaryButton: {
    marginTop: 12,
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
  secondaryButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default AddExpenseScreen;

